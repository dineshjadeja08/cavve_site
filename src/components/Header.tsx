import { Link, NavLink, useLocation } from 'react-router-dom'
import { Search, Heart, ShoppingBag, User, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useCommerceStore } from '../store/cart'
import { CartDrawer } from './CartDrawer'

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const { cart, wishlist, isCartOpen, openCart, closeCart } = useCommerceStore()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)
  const wishlistCount = wishlist.length
  const { pathname } = useLocation()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="header-left">
          <Link to="/" className="logo">CAVVE</Link>
        </div>

        <nav className="nav-links">
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/drop">Drop 001</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/about">Manifesto</NavLink>
        </nav>

        <div className="header-actions">
          <Link className="action-btn" to="/search" aria-label="Search"><Search size={20} strokeWidth={1.5} /></Link>
          <Link className="action-btn" to="/wishlist" aria-label="Wishlist">
            <Heart size={20} strokeWidth={1.5} />
            {wishlistCount > 0 && <span className="cart-count">{wishlistCount}</span>}
          </Link>
          <button 
            className="action-btn" 
            onClick={openCart}
            aria-label="Open cart drawer"
          >
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <Link className="action-btn" to="/account" aria-label="Account"><User size={20} strokeWidth={1.5} /></Link>
          <button className="mobile-only action-btn" onClick={() => setMenuOpen(true)} aria-label="Menu"><Menu size={24} /></button>
        </div>
      </header>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 1100, background: 'var(--bg)', 
              display: 'flex', flexDirection: 'column', padding: '60px 5%' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
              <span className="logo">CAVVE</span>
              <button onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={32} strokeWidth={1.5} /></button>
            </div>
            <nav style={{ display: 'grid', gap: '24px' }}>
              <Link to="/collections" style={{ fontSize: '48px', fontFamily: 'var(--font-serif)' }}>Collections</Link>
              <Link to="/drop" style={{ fontSize: '48px', fontFamily: 'var(--font-serif)' }}>Drop 001</Link>
              <Link to="/journal" style={{ fontSize: '48px', fontFamily: 'var(--font-serif)' }}>Journal</Link>
              <Link to="/about" style={{ fontSize: '48px', fontFamily: 'var(--font-serif)' }}>Manifesto</Link>
              <Link to="/account" style={{ fontSize: '48px', fontFamily: 'var(--font-serif)' }}>Account</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
