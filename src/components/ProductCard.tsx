import { Heart, Plus } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Product } from '../data/catalog'
import { formatInr } from '../lib/utils'
import { useCommerceStore } from '../store/cart'

export function ProductCard({ product }: { product: Product }) {
  const { addToCart, toggleWishlist, wishlist } = useCommerceStore()
  const saved = wishlist.includes(product.id)

  return (
    <article className="product-card fade-up">
      <Link 
        to={`/products/${product.slug}`} 
        className="product-media" 
        aria-label={product.name}
      >
        <img src={product.gallery[0]} alt={product.name} loading="lazy" />
        <img src={product.gallery[1]} alt="" aria-hidden="true" loading="lazy" style={{ position: 'absolute', inset: 0, opacity: 0 }} className="hover-img" />
        <div className="product-overlay">
          <button 
            className="icon-button" 
            onClick={(e) => {
              e.preventDefault()
              toggleWishlist(product.id)
            }} 
            aria-label="Save to wishlist"
          >
            <Heart size={18} fill={saved ? 'var(--accent)' : 'none'} stroke={saved ? 'var(--accent)' : 'currentColor'} />
          </button>
        </div>
      </Link>
      <div className="product-meta">
        <div>
          <Link to={`/products/${product.slug}`} className="product-name">{product.name}</Link>
          <p className="product-specs">{product.gsm} • {product.fit}</p>
        </div>
        <div className="product-actions">
          <span className="product-price">{formatInr(product.price)}</span>
        </div>
      </div>
      <button 
        className="primary-button wide" 
        onClick={() => addToCart(product)} 
        aria-label={`Quick add ${product.name}`}
        style={{ marginTop: '20px', padding: '12px', fontSize: '10px' }}
      >
        <Plus size={14} />
        Quick add
      </button>
    </article>
  )
}

