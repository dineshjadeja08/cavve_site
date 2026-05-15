import { NavLink } from 'react-router-dom'
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react'
import { useCommerceStore } from '../store/cart'

export function MobileNav() {
  const cartCount = useCommerceStore(state => state.cart.reduce((sum, item) => sum + item.quantity, 0))

  return (
    <nav className="mobile-bottom-nav">
      <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>
        <Home size={20} />
        <span>Home</span>
      </NavLink>
      <NavLink to="/collections" className={({ isActive }) => isActive ? 'active' : ''}>
        <Search size={20} />
        <span>Shop</span>
      </NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? 'active' : ''}>
        <div className="nav-icon-wrapper">
          <ShoppingBag size={20} />
          {cartCount > 0 && <span className="badge">{cartCount}</span>}
        </div>
        <span>Bag</span>
      </NavLink>
      <NavLink to="/wishlist" className={({ isActive }) => isActive ? 'active' : ''}>
        <Heart size={20} />
        <span>Saved</span>
      </NavLink>
      <NavLink to="/account" className={({ isActive }) => isActive ? 'active' : ''}>
        <User size={20} />
        <span>You</span>
      </NavLink>
    </nav>
  )
}
