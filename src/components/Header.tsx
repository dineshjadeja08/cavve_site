import { Link, NavLink, useLocation } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Logo } from './Logo'
import { useCommerceStore } from '../store/cart'
import { CartDrawer } from './CartDrawer'

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, wishlist, isCartOpen, openCart, closeCart } = useCommerceStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length
  const { pathname } = useLocation()

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="site-header">
        <Link to="/" className="brand-link">
          <Logo />
        </Link>
        
        <nav className="desktop-nav">
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/drop">Drop 001</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/about">Manifesto</NavLink>
        </nav>

        <div className="header-actions">
          <Link className="icon-button" to="/search" aria-label="Search"><Search size={18} /></Link>
          <Link className="icon-button with-badge" to="/wishlist" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && <span>{wishlistCount}</span>}
          </Link>
          <button 
            className="icon-button with-badge" 
            onClick={openCart}
            aria-label="Open cart drawer"
          >
            <ShoppingBag size={18} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </button>
          <Link className="icon-button" to="/account" aria-label="Account"><User size={18} /></Link>
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu size={20} /></button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 200, background: 'var(--bg)', 
              display: 'flex', flexDirection: 'column', padding: '40px' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
              <Logo />
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={32} /></button>
            </div>
            <nav style={{ display: 'grid', gap: '32px' }}>
              <Link to="/collections" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Collections</Link>
              <Link to="/drop" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>The Drop</Link>
              <Link to="/journal" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Journal</Link>
              <Link to="/about" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Manifesto</Link>
              <Link to="/account" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Account</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
