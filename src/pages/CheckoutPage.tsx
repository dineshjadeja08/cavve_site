import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ShieldCheck, ChevronLeft, Lock } from 'lucide-react'
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

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 }
}

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
  const shipping = subtotal > 5000 ? 0 : 250
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
    <motion.div {...pageTransition} className="section-padding page-header-offset checkout-page">
      <SEO title="Checkout" description="Securely complete your CAVVE purchase." />
      
      <div className="checkout-container">
        <Link to="/cart" className="back-link">
          <ChevronLeft size={16} /> Back to bag
        </Link>
        
        <div className="checkout-layout">
          <div className="checkout-main">
            <h1>Checkout</h1>
            
            {!session && (
              <div className="auth-prompt">
                <p>Already have an account? <Link to="/account">Sign in</Link> for a faster experience.</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="checkout-form">
              {checkoutError && <div className="form-error">{checkoutError}</div>}
              
              <section className="form-section">
                <h2>Contact Information</h2>
                <div className="form-grid">
                  <div className="field">
                    <label>Full Name</label>
                    <input {...register('name')} placeholder="e.g. Alex Singh" />
                    {errors.name && <span className="error">{errors.name.message}</span>}
                  </div>
                  <div className="field">
                    <label>Email Address</label>
                    <input {...register('email')} placeholder="alex@example.com" />
                    {errors.email && <span className="error">{errors.email.message}</span>}
                  </div>
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input {...register('phone')} placeholder="+91 98765 43210" />
                  {errors.phone && <span className="error">{errors.phone.message}</span>}
                </div>
              </section>

              <section className="form-section">
                <h2>Shipping Address</h2>
                <div className="field">
                  <label>Address</label>
                  <input {...register('address')} placeholder="House No, Street, Landmark" />
                  {errors.address && <span className="error">{errors.address.message}</span>}
                </div>
                <div className="form-grid">
                  <div className="field">
                    <label>City</label>
                    <input {...register('city')} placeholder="Mumbai" />
                    {errors.city && <span className="error">{errors.city.message}</span>}
                  </div>
                  <div className="field">
                    <label>Pincode</label>
                    <input {...register('pincode')} placeholder="400001" />
                    {errors.pincode && <span className="error">{errors.pincode.message}</span>}
                  </div>
                </div>
              </section>

              <div className="checkout-actions">
                <div className="security-notice">
                  <Lock size={14} />
                  <span>Secure SSL Encrypted Checkout</span>
                </div>
                <button className="primary-button wide" type="submit" disabled={isPaying}>
                  {isPaying ? 'Processing...' : `Pay ${formatInr(total)}`}
                </button>
              </div>
            </form>
          </div>

          <aside className="checkout-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>
              <div className="summary-items">
                {cart.map(item => (
                  <div key={`${item.product.id}-${item.size}`} className="summary-item">
                    <div className="item-img">
                      <img src={item.product.gallery[0]} alt={item.product.name} />
                      <span className="qty-badge">{item.quantity}</span>
                    </div>
                    <div className="item-info">
                      <h3>{item.product.name}</h3>
                      <p>Size {item.size}</p>
                    </div>
                    <div className="item-price">
                      {formatInr(item.product.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatInr(shipping)}</span>
                </div>
                <div className="total-row grand-total">
                  <span>Total</span>
                  <span>{formatInr(total)}</span>
                </div>
              </div>

              <div className="trust-block">
                <ShieldCheck size={18} />
                <p>Your data is protected by industry-standard encryption. We never store your card details.</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  )
}
