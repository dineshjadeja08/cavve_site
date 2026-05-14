import axios from 'axios'

const baseUrl = 'https://apiv2.shiprocket.in/v1/external'
let cachedToken: { token: string; expiresAt: number } | null = null

type ShiprocketOrderPayload = {
  id?: string
  orderId?: string
  amount?: number
  customer?: {
    name?: string
    email?: string
    phone?: string
    address?: string
    line1?: string
    line2?: string
    city?: string
    state?: string
    pincode?: string
  }
  items?: {
    quantity: number
    variantSku?: string
    product?: {
      id?: string
      name?: string
      price?: number
    }
  }[]
}

export async function getShiprocketToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token
  }

  const { data } = await axios.post(`${baseUrl}/auth/login`, {
    email: process.env.SHIPROCKET_EMAIL,
    password: process.env.SHIPROCKET_PASSWORD,
  })

  cachedToken = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  }

  return cachedToken.token
}

export async function createShiprocketOrder(orderPayload: ShiprocketOrderPayload, token?: string) {
  const authToken = token ?? (await getShiprocketToken())
  const payload = toShiprocketPayload(orderPayload)

  const { data } = await axios.post(`${baseUrl}/orders/create/adhoc`, payload, {
    headers: {
      Authorization: `Bearer ${authToken}`,
      'Content-Type': 'application/json',
    },
  })

  // Store shipment_id, awb_code, courier_name, and tracking status in Supabase here.
  return data
}

function toShiprocketPayload(orderPayload: ShiprocketOrderPayload) {
  const now = new Date().toISOString().slice(0, 10)
  const addressParts = [
    orderPayload?.customer?.address,
    orderPayload?.customer?.line1,
    orderPayload?.customer?.line2,
  ].filter(Boolean)

  return {
    order_id: orderPayload?.orderId ?? orderPayload?.id ?? `cavve-${Date.now()}`,
    order_date: now,
    pickup_location: process.env.SHIPROCKET_PICKUP_LOCATION ?? 'Primary',
    billing_customer_name: orderPayload?.customer?.name,
    billing_address: addressParts.join(', '),
    billing_city: orderPayload?.customer?.city,
    billing_pincode: orderPayload?.customer?.pincode,
    billing_state: orderPayload?.customer?.state ?? 'NA',
    billing_country: 'India',
    billing_email: orderPayload?.customer?.email,
    billing_phone: orderPayload?.customer?.phone,
    shipping_is_billing: true,
    order_items: (orderPayload.items ?? []).map((item) => ({
      name: item.product?.name,
      sku: item.variantSku ?? item.product?.id,
      units: item.quantity,
      selling_price: item.product?.price,
    })),
    payment_method: 'Prepaid',
    sub_total: orderPayload?.amount,
    length: 28,
    breadth: 22,
    height: 4,
    weight: 0.45,
  }
}
