import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Lock } from 'lucide-react'
import { useCommerceStore } from '../store/cart'
import { useAuthState } from '../context/AuthContext'
import { formatInr } from '../lib/utils'
import { SEO } from '../components/SEO'

const checkoutSchema = z.object({
  name: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(10, 'Complete address is required'),
  city: z.string().min(2, 'City is required'),
  pincode: z.string().min(6, 'Valid pincode is required'),
})

type CheckoutValues = z.infer<typeof checkoutSchema>

export function CheckoutPage() {
  const { cart, clearCart } = useCommerceStore()
  const navigate = useNavigate()
  const { session } = useAuthState()
  const [checkoutError, setCheckoutError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutValues>({ 
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: session?.user?.user_metadata?.full_name || '',
      email: session?.user?.email || '',
    }
  })
  
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 4000 ? 0 : 250
  const total = subtotal + shipping

  async function onSubmit(values: CheckoutValues) {
    setCheckoutError('')
    if (!session) {
      setCheckoutError('Please sign in to complete your purchase.')
      return
    }
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.')
      return
    }

    setIsPaying(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8787'}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ customer: values, items: cart, amount: total }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error ?? 'Could not create payment order.')
      }

      const order = await response.json()
      const ready = await loadRazorpay()
      
      if (!ready || !(window as any).Razorpay) {
        throw new Error('Razorpay checkout could not be loaded.')
      }

      const razorpay = new (window as any).Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: 'CAVVE',
        description: 'WEAR DISCIPLINE',
        order_id: order.orderId,
        prefill: {
          name: values.name,
          email: values.email,
          contact: values.phone,
        },
        theme: { color: '#0D0D0D' },
        handler: async (response: any) => {
          const verification = await fetch(`${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8787'}/api/payments/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${session.access_token}`,
            },
            body: JSON.stringify({ ...response, appOrderId: order.appOrderId }),
          })

          if (!verification.ok) {
            const body = await verification.json().catch(() => null)
            setCheckoutError(body?.error ?? 'Payment verification failed.')
            setIsPaying(false)
            return
          }

          clearCart()
          navigate(`/checkout/success?order=${order.appOrderId}`)
        },
        modal: {
          ondismiss: () => setIsPaying(false),
        },
      })

      razorpay.open()
    } catch (err: any) {
      setCheckoutError(err.message)
      setIsPaying(false)
    }
  }

  function loadRazorpay() {
    if ((window as any).Razorpay) return Promise.resolve(true)
    return new Promise<boolean>((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  return (
    <div className="section-padding page-header-offset checkout-page">
      <SEO title="Checkout | CAVVE" description="Securely complete your purchase." />
      
      <header style={{ marginBottom: '80px', textAlign: 'center' }}>
        <span className="eyebrow">Final Protocol</span>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 0.9 }}>Checkout</h1>
      </header>

      <div className="checkout-layout">
        <div className="checkout-main">
          <form onSubmit={handleSubmit(onSubmit)} className="admin-form">
            {checkoutError && (
              <div style={{ padding: '20px', background: '#FEF2F2', color: '#991B1B', fontSize: '14px', marginBottom: '32px' }}>
                {checkoutError}
              </div>
            )}
            
            <section style={{ marginBottom: '60px' }}>
              <h2 className="serif" style={{ fontSize: '32px', marginBottom: '32px' }}>Shipping Intelligence</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="field">
                  <label>Full Name</label>
                  <input {...register('name')} placeholder="Alex Singh" />
                  {errors.name && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.name.message}</span>}
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input {...register('email')} placeholder="alex@example.com" />
                  {errors.email && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.email.message}</span>}
                </div>
              </div>
              <div className="field">
                <label>Phone Number</label>
                <input {...register('phone')} placeholder="+91 98765 43210" />
                {errors.phone && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.phone.message}</span>}
              </div>
              <div className="field">
                <label>Shipping Address</label>
                <textarea {...register('address')} rows={3} placeholder="House No, Street, Landmark" />
                {errors.address && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.address.message}</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div className="field">
                  <label>City</label>
                  <input {...register('city')} placeholder="Mumbai" />
                  {errors.city && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.city.message}</span>}
                </div>
                <div className="field">
                  <label>Pincode</label>
                  <input {...register('pincode')} placeholder="400001" />
                  {errors.pincode && <span style={{ color: 'var(--error)', fontSize: '11px' }}>{errors.pincode.message}</span>}
                </div>
              </div>
            </section>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--secondary)', marginBottom: '32px' }}>
              <Lock size={16} />
              <p style={{ fontSize: '12px' }}>Payments are secured by Razorpay SSL Encryption.</p>
            </div>

            <button className="primary-button wide" type="submit" disabled={isPaying}>
              {isPaying ? 'Establishing Connection...' : `Authorize Payment — ${formatInr(total)}`}
            </button>
          </form>
        </div>

        <aside className="checkout-sidebar">
          <div style={{ padding: '40px', background: 'white', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Allocation</h2>
            <div style={{ display: 'grid', gap: '24px', marginBottom: '32px' }}>
              {cart.map(item => (
                <div key={`${item.product.id}-${item.size}`} style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '80px', background: 'var(--surface)', position: 'relative' }}>
                    <img src={item.product.gallery[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{ position: 'absolute', top: '-8px', right: '-8px', background: 'var(--primary)', color: 'white', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                      {item.quantity}
                    </span>
                  </div>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 700 }}>{item.product.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>Size {item.size}</p>
                  </div>
                  <div style={{ marginLeft: 'auto', fontSize: '13px', fontWeight: 700 }}>
                    {formatInr(item.product.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '14px' }}>
                <span style={{ color: 'var(--secondary)' }}>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px' }}>
                <span style={{ color: 'var(--secondary)' }}>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatInr(shipping)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700 }}>
                <span>Total</span>
                <span>{formatInr(total)}</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
