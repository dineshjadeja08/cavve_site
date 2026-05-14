import crypto from 'node:crypto'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import Razorpay from 'razorpay'
import { createShiprocketOrder, getShiprocketToken } from './shiprocket'
import { getUserFromBearer, supabaseAdmin } from './supabaseAdmin'

dotenv.config()

type CheckoutItem = {
  product: {
    id: string
    slug: string
    name: string
    price: number
    color: string
  }
  size: string
  quantity: number
}

type CheckoutPayload = {
  amount: number
  items: CheckoutItem[]
  customer: {
    name: string
    email: string
    phone: string
    address: string
    city: string
    state?: string
    pincode: string
  }
}

type StoredOrderItem = {
  quantity: number
  name: string
  unit_price_inr: number
  variants?: { sku?: string } | { sku?: string }[] | null
}

type RazorpayWebhookEvent = {
  event: string
  payload?: {
    payment?: {
      entity?: {
        id?: string
        order_id?: string
      }
    }
    order?: {
      entity?: {
        id?: string
      }
    }
  }
}

const app = express()
const port = process.env.PORT ?? 8787

app.use(cors({ origin: process.env.VITE_SITE_URL ?? 'http://localhost:5173' }))

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? 'rzp_test_missing',
  key_secret: process.env.RAZORPAY_KEY_SECRET ?? 'missing',
})

app.post('/api/webhooks/razorpay', express.raw({ type: 'application/json' }), async (req, res) => {
  const signature = req.header('x-razorpay-signature') ?? ''
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET ?? '')
    .update(req.body)
    .digest('hex')

  if (signature !== expected) {
    return res.status(401).json({ error: 'Invalid webhook signature' })
  }

  const event = JSON.parse(req.body.toString())
  await reconcileRazorpayEvent(event)
  return res.json({ received: true, event: event.event })
})

app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'cavve-api' }))

app.post('/api/payments/create-order', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' })
  }

  const user = await getUserFromBearer(req.header('authorization') ?? undefined)
  if (!user) {
    return res.status(401).json({ error: 'Sign in before checkout' })
  }

  const payload = req.body as CheckoutPayload
  if (!payload.amount || !payload.items?.length) {
    return res.status(400).json({ error: 'Checkout amount and items are required' })
  }

  await ensureProfile(user.id, payload.customer.name, payload.customer.phone)
  const address = await createAddress(user.id, payload.customer)
  const mappedItems = await mapCheckoutItems(payload.items)
  const subtotal = mappedItems.reduce((sum, item) => sum + item.unit_price_inr * item.quantity, 0)

  if (subtotal !== Number(payload.amount)) {
    return res.status(409).json({ error: 'Cart amount changed. Refresh and try again.' })
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: subtotal * 100,
    currency: 'INR',
    receipt: `cavve_${Date.now()}`,
    notes: {
      user_id: user.id,
      customer_email: payload.customer.email,
      source: 'cavve-react-storefront',
    },
  })

  const { data: order, error: orderError } = await supabaseAdmin
    .from('orders')
    .insert({
      user_id: user.id,
      status: 'pending',
      subtotal_inr: subtotal,
      total_inr: subtotal,
      shipping_address_id: address.id,
      razorpay_order_id: razorpayOrder.id,
    })
    .select('id, razorpay_order_id, total_inr')
    .single()

  if (orderError) throw orderError

  const orderItems = mappedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id,
    name: item.name,
    size: item.size,
    color: item.color,
    quantity: item.quantity,
    unit_price_inr: item.unit_price_inr,
  }))

  const { error: itemsError } = await supabaseAdmin.from('order_items').insert(orderItems)
  if (itemsError) throw itemsError

  const { error: paymentError } = await supabaseAdmin.from('payments').insert({
    order_id: order.id,
    provider_order_id: razorpayOrder.id,
    status: 'created',
    amount_inr: subtotal,
    raw_payload: razorpayOrder,
  })
  if (paymentError) throw paymentError

  await syncCart(user.id, mappedItems)

  return res.json({
    appOrderId: order.id,
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
  })
})

app.post('/api/payments/verify', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' })
  }

  const user = await getUserFromBearer(req.header('authorization') ?? undefined)
  if (!user) {
    return res.status(401).json({ error: 'Sign in before payment verification' })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appOrderId } = req.body
  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET ?? '')
    .update(body)
    .digest('hex')

  if (expected !== razorpay_signature) {
    await markPaymentFailed(razorpay_order_id, { reason: 'signature_mismatch' })
    return res.status(401).json({ error: 'Payment signature verification failed' })
  }

  const payment = await razorpay.payments.fetch(razorpay_payment_id)
  if (payment.status !== 'captured') {
    await markPaymentFailed(razorpay_order_id, payment)
    return res.status(409).json({ error: 'Payment not captured yet', status: payment.status })
  }

  const order = await markOrderPaid(razorpay_order_id, razorpay_payment_id, payment)
  await createShipmentForOrder(appOrderId ?? order.id).catch((error) => {
    console.error('Shiprocket creation queued for retry', error)
  })

  return res.json({ verified: true, paymentId: razorpay_payment_id, orderId: order.id })
})

app.get('/api/orders/track/:reference', async (req, res) => {
  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Supabase admin client is not configured' })
  }

  const reference = req.params.reference
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(reference)
  const query = supabaseAdmin
    .from('orders')
    .select('id, status, total_inr, razorpay_order_id, created_at, shipments(status, awb_code, courier_name, tracking_url)')

  const { data, error } = isUuid
    ? await query.eq('id', reference).maybeSingle()
    : await query.eq('razorpay_order_id', reference).maybeSingle()

  if (error) throw error
  if (!data) return res.status(404).json({ error: 'Order not found' })
  return res.json(data)
})

app.post('/api/shipments/create', async (req, res) => {
  const token = await getShiprocketToken()
  const shipment = await createShiprocketOrder(req.body, token)
  return res.json(shipment)
})

async function ensureProfile(userId: string, fullName?: string, phone?: string) {
  const { error: insertError } = await supabaseAdmin!
    .from('profiles')
    .upsert({ id: userId, full_name: fullName, phone, role: 'customer' }, { onConflict: 'id', ignoreDuplicates: true })
  if (insertError) throw insertError

  const { error } = await supabaseAdmin!
    .from('profiles')
    .update({ full_name: fullName, phone })
    .eq('id', userId)
  if (error) throw error
}

async function createAddress(userId: string, customer: CheckoutPayload['customer']) {
  const { data, error } = await supabaseAdmin!
    .from('addresses')
    .insert({
      user_id: userId,
      label: 'Checkout',
      full_name: customer.name,
      phone: customer.phone,
      line1: customer.address,
      city: customer.city,
      state: customer.state ?? 'NA',
      pincode: customer.pincode,
      country: 'India',
      is_default: true,
    })
    .select('id')
    .single()

  if (error) throw error
  return data
}

async function mapCheckoutItems(items: CheckoutItem[]) {
  return Promise.all(
    items.map(async (item) => {
      const { data: product, error: productError } = await supabaseAdmin!
        .from('products')
        .select('id, name, price_inr')
        .eq('slug', item.product.slug)
        .single()

      if (productError) throw productError

      const { data: variant, error: variantError } = await supabaseAdmin!
        .from('variants')
        .select('id, color, sku')
        .eq('product_id', product.id)
        .eq('size', item.size)
        .single()

      if (variantError) throw variantError

      return {
        product_id: product.id,
        variant_id: variant.id,
        variantSku: variant.sku,
        name: product.name,
        size: item.size,
        color: variant.color ?? item.product.color,
        quantity: item.quantity,
        unit_price_inr: product.price_inr,
      }
    }),
  )
}

async function syncCart(userId: string, items: Awaited<ReturnType<typeof mapCheckoutItems>>) {
  const { data: cart, error: cartError } = await supabaseAdmin!
    .from('cart')
    .upsert({ user_id: userId }, { onConflict: 'user_id' })
    .select('id')
    .single()
  if (cartError) throw cartError

  await supabaseAdmin!.from('cart_items').delete().eq('cart_id', cart.id)

  const { error } = await supabaseAdmin!.from('cart_items').insert(
    items.map((item) => ({
      cart_id: cart.id,
      variant_id: item.variant_id,
      quantity: item.quantity,
    })),
  )
  if (error) throw error
}

async function markOrderPaid(razorpayOrderId: string, paymentId: string | undefined, rawPayload: unknown) {
  const { data: order, error: orderError } = await supabaseAdmin!
    .from('orders')
    .update({ status: 'paid', updated_at: new Date().toISOString() })
    .eq('razorpay_order_id', razorpayOrderId)
    .select('id, user_id, total_inr, razorpay_order_id')
    .single()
  if (orderError) throw orderError

  const { error: paymentError } = await supabaseAdmin!
    .from('payments')
    .update({
      provider_payment_id: paymentId,
      status: 'captured',
      raw_payload: rawPayload,
    })
    .eq('provider_order_id', razorpayOrderId)
  if (paymentError) throw paymentError

  return order
}

async function markPaymentFailed(razorpayOrderId: string, rawPayload: unknown) {
  await supabaseAdmin!
    .from('orders')
    .update({ status: 'failed', updated_at: new Date().toISOString() })
    .eq('razorpay_order_id', razorpayOrderId)
  await supabaseAdmin!
    .from('payments')
    .update({ status: 'failed', raw_payload: rawPayload })
    .eq('provider_order_id', razorpayOrderId)
}

async function createShipmentForOrder(orderId: string) {
  const { data: order, error } = await supabaseAdmin!
    .from('orders')
    .select('id, total_inr, addresses(full_name, phone, line1, line2, city, state, pincode), order_items(name, size, color, quantity, unit_price_inr, variants(sku))')
    .eq('id', orderId)
    .single()

  if (error) throw error

  const address = Array.isArray(order.addresses) ? order.addresses[0] : order.addresses
  const orderItems = order.order_items ?? []
  const payload = {
    orderId: order.id,
    amount: order.total_inr,
    customer: {
      name: address?.full_name,
      phone: address?.phone,
      line1: address?.line1,
      line2: address?.line2,
      city: address?.city,
      state: address?.state,
      pincode: address?.pincode,
    },
    items: (orderItems as StoredOrderItem[]).map((item) => ({
      quantity: item.quantity,
      product: { name: item.name, price: item.unit_price_inr },
      variantSku: Array.isArray(item.variants) ? item.variants[0]?.sku : item.variants?.sku,
    })),
  }

  try {
    const shipment = await createShiprocketOrder(payload)
    const { error: shipmentError } = await supabaseAdmin!.from('shipments').insert({
      order_id: order.id,
      shiprocket_order_id: shipment.order_id?.toString(),
      shipment_id: shipment.shipment_id?.toString(),
      awb_code: shipment.awb_code,
      courier_name: shipment.courier_name,
      status: shipment.awb_code ? 'awb_assigned' : 'created',
      tracking_url: shipment.tracking_url,
    })
    if (shipmentError) throw shipmentError

    await supabaseAdmin!.from('orders').update({ status: 'processing' }).eq('id', order.id)
    return shipment
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Shiprocket request failed'
    await supabaseAdmin!.from('shipments').insert({
      order_id: order.id,
      status: 'failed',
      retry_count: 1,
      last_error: message,
    })
    throw error
  }
}

async function reconcileRazorpayEvent(event: RazorpayWebhookEvent) {
  const paymentEntity = event.payload?.payment?.entity
  const orderEntity = event.payload?.order?.entity
  const razorpayOrderId = paymentEntity?.order_id ?? orderEntity?.id
  if (!razorpayOrderId || !supabaseAdmin) return

  if (event.event === 'payment.captured' || event.event === 'order.paid') {
    const paymentId = event.payload?.payment?.entity?.id
    const order = await markOrderPaid(razorpayOrderId, paymentId, event)
    await createShipmentForOrder(order.id).catch((error) => console.error('Webhook shipment creation failed', error))
  }

  if (event.event === 'payment.failed') {
    await markPaymentFailed(razorpayOrderId, event)
  }
}

app.use((error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  void _next
  console.error(error)
  res.status(500).json({ error: error instanceof Error ? error.message : 'Unexpected server error' })
})

app.listen(port, () => {
  console.log(`CAVVE API listening on http://localhost:${port}`)
})
