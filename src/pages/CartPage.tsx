import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck } from 'lucide-react'
import { useCommerceStore } from '../store/cart'
import { formatInr } from '../lib/utils'
import { SEO } from '../components/SEO'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as any }
}

export function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore()
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 5000 ? 0 : 250

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset cart-page">
      <SEO title="Your Bag" description="Review your selected CAVVE pieces before checkout." />
      
      <div className="cart-container" style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '60px', fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, textTransform: 'uppercase' }}>Your Bag</h1>
        
        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <p className="eyebrow">Your bag is disciplined (empty).</p>
            <h2 style={{ margin: '24px 0' }}>Ready to start your uniform?</h2>
            <Link className="primary-button" to="/collections" style={{ margin: '0 auto' }}>Shop the drop</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <div className="cart-header desktop-only">
                <span>Product</span>
                <span>Quantity</span>
                <span style={{ textAlign: 'right' }}>Total</span>
              </div>
              <div style={{ display: 'grid', gap: '1px', background: 'var(--border)' }}>
                {cart.map((item) => (
                  <article key={`${item.product.id}-${item.size}`} className="cart-item">
                    <div className="cart-item-info">
                      <Link to={`/products/${item.product.slug}`}>
                        <img src={item.product.gallery[0]} alt={item.product.name} />
                      </Link>
                      <div>
                        <h3>{item.product.name}</h3>
                        <p className="item-meta">{item.product.gsm} • Size {item.size}</p>
                        <button 
                          onClick={() => removeFromCart(item.product.id, item.size)}
                          className="remove-btn"
                        >
                          <Trash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-qty">
                      <div className="qty-selector">
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} disabled={item.quantity <= 1}>
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}>
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="cart-item-total">
                      <p>{formatInr(item.product.price * item.quantity)}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="cart-summary">
              <div className="summary-card">
                <h2>Summary</h2>
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                <div className="summary-row">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'FREE' : formatInr(shipping)}</span>
                </div>
                {shipping > 0 && (
                  <p className="shipping-notice">Add {formatInr(5000 - subtotal)} more for free shipping.</p>
                )}
                <div className="summary-total">
                  <span>Total</span>
                  <span>{formatInr(subtotal + shipping)}</span>
                </div>
                <Link className="primary-button wide" to="/checkout">
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
                
                <div className="trust-badges">
                  <div className="badge">
                    <ShieldCheck size={14} />
                    <span>Secure Checkout</span>
                  </div>
                  <p>Payments processed by Razorpay. All major cards, UPI, and netbanking accepted.</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </motion.div>
  )
}
