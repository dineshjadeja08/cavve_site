import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useCommerceStore } from '../store/cart'
import { formatInr } from '../lib/utils'
import { SEO } from '../components/SEO'

export function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore()
  const navigate = useNavigate()

  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shipping = subtotal > 4000 ? 0 : 250
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="section-padding page-header-offset" style={{ textAlign: 'center', padding: '160px 5%' }}>
        <SEO title="Shopping Bag | CAVVE" description="Your bag is currently empty." />
        <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
        <h1 style={{ fontSize: '48px', marginBottom: '24px' }}>Bag Empty.</h1>
        <p style={{ color: 'var(--secondary)', marginBottom: '40px', maxWidth: '400px', margin: '0 auto 40px' }}>
          Your protocol is currently unassigned. Return to the collection to build your uniform.
        </p>
        <Link to="/collections" className="primary-button">View Collection</Link>
      </div>
    )
  }

  return (
    <div className="section-padding page-header-offset">
      <SEO title="Shopping Bag | CAVVE" description={`Your bag has ${cart.length} items.`} />
      
      <header style={{ marginBottom: '80px', textAlign: 'center' }}>
        <span className="eyebrow">Inventory Protocol</span>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 0.9 }}>Your Bag</h1>
      </header>

      <div className="cart-layout">
        <div className="cart-items">
          <div style={{ display: 'grid', gap: '32px' }}>
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div 
                  key={`${item.product.id}-${item.size}`}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '120px 1fr auto', 
                    gap: '40px', 
                    paddingBottom: '32px', 
                    borderBottom: '1px solid var(--border)',
                    alignItems: 'center'
                  }}
                >
                  <Link to={`/products/${item.product.slug}`} style={{ background: 'var(--surface)', aspectRatio: '3/4', overflow: 'hidden' }}>
                    <img src={item.product.gallery[0]} alt={item.product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </Link>
                  
                  <div>
                    <h3 className="serif" style={{ fontSize: '24px', marginBottom: '4px' }}>
                      <Link to={`/products/${item.product.slug}`}>{item.product.name}</Link>
                    </h3>
                    <p style={{ fontSize: '12px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '16px' }}>
                      Size: {item.size} • {item.product.color}
                    </p>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', padding: '4px' }}>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} style={{ padding: '8px' }}><Minus size={14} /></button>
                        <span style={{ padding: '0 16px', fontSize: '13px', fontWeight: 700 }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} style={{ padding: '8px' }}><Plus size={14} /></button>
                      </div>
                      <button 
                        onClick={() => removeFromCart(item.product.id, item.size)}
                        style={{ color: 'var(--secondary)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Trash2 size={12} /> Remove
                      </button>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontSize: '18px', fontWeight: 700 }}>{formatInr(item.product.price * item.quantity)}</p>
                    <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>{formatInr(item.product.price)} / unit</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Summary Card */}
        <aside className="cart-summary">
          <div style={{ padding: '40px', background: 'white', border: '1px solid var(--border)', position: 'sticky', top: '120px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Order Summary</h2>
            
            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--secondary)' }}>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <span style={{ color: 'var(--secondary)' }}>Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatInr(shipping)}</span>
              </div>
              {shipping > 0 && (
                <p style={{ fontSize: '11px', color: 'var(--secondary)', fontStyle: 'italic' }}>
                  Add {formatInr(4000 - subtotal)} more for free shipping.
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 700, paddingTop: '24px', borderTop: '1px solid var(--border)', marginBottom: '40px' }}>
              <span>Total</span>
              <span>{formatInr(total)}</span>
            </div>

            <button 
              className="primary-button wide"
              onClick={() => navigate('/checkout')}
            >
              Begin Protocol <ArrowRight size={16} />
            </button>
            
            <div style={{ marginTop: '32px', display: 'flex', gap: '12px', alignItems: 'center', justifyContent: 'center', opacity: 0.5 }}>
              <ShieldCheck size={16} />
              <span style={{ fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Transaction Protocol</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
