import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/catalog'
import { formatInr } from '../lib/utils'
import { useCommerceStore } from '../store/cart'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { wishlist, toggleWishlist } = useCommerceStore()
  const isWishlisted = wishlist.includes(product.id)

  return (
    <div className="product-card group">
      <Link to={`/products/${product.slug}`} className="product-image-wrapper">
        <img 
          src={product.gallery[0]} 
          alt={product.name}
          loading="lazy"
        />
        
        <div className="quick-add-overlay">
          <button className="primary-button wide" style={{ padding: '12px', fontSize: '10px' }}>
            Quick View <ShoppingBag size={14} />
          </button>
        </div>
        
        <button 
          className={`wishlist-btn ${isWishlisted ? 'active' : ''}`}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id)
          }}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'white',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isWishlisted ? 'var(--error)' : 'var(--primary)',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            zIndex: 10
          }}
        >
          <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} strokeWidth={1.5} />
        </button>
      </Link>

      <div className="product-meta">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <h3 className="product-name">
            <Link to={`/products/${product.slug}`}>{product.name}</Link>
          </h3>
          <span className="product-price">{formatInr(product.price)}</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--secondary)', marginTop: '4px' }}>
          {product.gsm} • {product.fit}
        </p>
      </div>
    </div>
  )
}
