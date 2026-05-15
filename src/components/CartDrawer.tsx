import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, ArrowRight, Trash2, Plus, Minus } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCommerceStore } from '../store/cart'
import { formatInr } from '../lib/utils'

export function CartDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore()
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div 
            className="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <div className="drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShoppingBag size={20} />
                <h2>Your Bag ({cart.length})</h2>
              </div>
              <button onClick={onClose} aria-label="Close drawer"><X size={24} /></button>
            </div>

            <div className="drawer-content">
              {cart.length === 0 ? (
                <div className="empty-drawer">
                  <p>Your bag is empty.</p>
                  <Link to="/collections" className="primary-button" onClick={onClose}>Shop the collection</Link>
                </div>
              ) : (
                <div className="drawer-items">
                  {cart.map((item) => (
                    <div key={`${item.product.id}-${item.size}`} className="drawer-item">
                      <img src={item.product.gallery[0]} alt={item.product.name} />
                      <div className="item-details">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h3>{item.product.name}</h3>
                          <button onClick={() => removeFromCart(item.product.id, item.size)}><Trash2 size={14} /></button>
                        </div>
                        <p className="item-meta">Size: {item.size}</p>
                        <div className="item-actions">
                          <div className="qty-selector small">
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}><Minus size={12} /></button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}><Plus size={12} /></button>
                          </div>
                          <p className="item-price">{formatInr(item.product.price * item.quantity)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="drawer-footer">
                <div className="subtotal-row">
                  <span>Subtotal</span>
                  <span>{formatInr(subtotal)}</span>
                </div>
                <p className="shipping-info">Shipping and taxes calculated at checkout.</p>
                <Link to="/cart" className="secondary-button wide" onClick={onClose} style={{ marginBottom: '12px' }}>View Bag</Link>
                <Link to="/checkout" className="primary-button wide" onClick={onClose}>
                  Checkout <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
