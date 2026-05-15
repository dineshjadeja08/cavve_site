import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Heart, Truck, RefreshCcw, ShieldCheck, ArrowLeft, ShoppingBag, Ruler } from 'lucide-react'
import { products } from '../data/catalog'
import { formatInr } from '../lib/utils'
import { useCommerceStore } from '../store/cart'
import { SEO } from '../components/SEO'

export function ProductPage() {
  const { slug } = useParams()
  const product = products.find(p => p.slug === slug)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart, wishlist, toggleWishlist, openCart } = useCommerceStore()

  if (!product) return <div className="section-padding page-header-offset">Product not found.</div>

  const isWishlisted = wishlist.includes(product.id)

  const handleAddToCart = () => {
    if (!selectedSize) {
      alert('Please select a size')
      return
    }
    addToCart(product, selectedSize)
    openCart()
  }

  return (
    <div className="product-page page-header-offset">
      <SEO title={`${product.name} | CAVVE`} description={product.copy} />
      
      <div className="section-padding" style={{ paddingTop: '20px' }}>
        <Link to="/collections" className="text-link" style={{ marginBottom: '40px', border: 'none' }}>
          <ArrowLeft size={16} /> Back to Collection
        </Link>

        <div className="product-detail-layout" style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '80px' }}>
          {/* Image Gallery */}
          <div className="product-gallery">
            <div className="main-image" style={{ position: 'relative', overflow: 'hidden', background: 'var(--surface)', marginBottom: '24px' }}>
              <motion.img 
                key={activeImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                src={product.gallery[activeImage]} 
                alt={product.name}
                style={{ width: '100%', aspectRatio: '3/4', objectFit: 'cover' }}
              />
            </div>
            <div className="thumbnail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {product.gallery.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  style={{ 
                    border: activeImage === i ? '1px solid var(--primary)' : '1px solid var(--border)',
                    opacity: activeImage === i ? 1 : 0.6,
                    transition: 'all 0.3s'
                  }}
                >
                  <img src={img} alt={`Thumbnail ${i}`} style={{ width: '100%', aspectRatio: '1/1', objectFit: 'cover' }} />
                </button>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="product-info" style={{ position: 'sticky', top: '120px', height: 'fit-content' }}>
            <span className="eyebrow">{product.fit} / {product.gsm}</span>
            <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>{product.name}</h1>
            <p className="price" style={{ fontSize: '24px', fontWeight: 600, marginBottom: '40px' }}>
              {formatInr(product.price)}
              {product.compareAt && (
                <span style={{ fontSize: '16px', color: 'var(--secondary)', textDecoration: 'line-through', marginLeft: '12px' }}>
                  {formatInr(product.compareAt)}
                </span>
              )}
            </p>

            <div className="description" style={{ marginBottom: '60px', color: 'var(--secondary)', lineHeight: 1.8 }}>
              <p>{product.copy}</p>
              <ul style={{ marginTop: '24px', display: 'grid', gap: '8px' }}>
                {product.details.map((detail, idx) => (
                  <li key={idx} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '4px', background: 'var(--primary)', borderRadius: '50%' }} />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            <div className="size-selection" style={{ marginBottom: '60px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Size</span>
                <button className="text-link" style={{ fontSize: '11px', border: 'none' }}>
                  <Ruler size={14} /> Size Guide
                </button>
              </div>
              <div className="size-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
                {product.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`size-btn ${selectedSize === size ? 'active' : ''}`}
                    style={{
                      padding: '16px 0',
                      border: '1px solid',
                      borderColor: selectedSize === size ? 'var(--primary)' : 'var(--border)',
                      background: selectedSize === size ? 'var(--primary)' : 'transparent',
                      color: selectedSize === size ? 'white' : 'var(--primary)',
                      fontSize: '12px',
                      fontWeight: 700,
                      transition: 'all 0.3s'
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="actions" style={{ display: 'flex', gap: '16px', marginBottom: '60px' }}>
              <button 
                className="primary-button" 
                style={{ flex: 1 }}
                onClick={handleAddToCart}
              >
                Add to Bag <ShoppingBag size={18} />
              </button>
              <button 
                className="secondary-button"
                onClick={() => toggleWishlist(product.id)}
                style={{ width: '60px', padding: '0', justifyContent: 'center', borderColor: isWishlisted ? 'var(--error)' : 'var(--border)' }}
              >
                <Heart size={20} fill={isWishlisted ? 'var(--error)' : 'none'} color={isWishlisted ? 'var(--error)' : 'currentColor'} />
              </button>
            </div>

            <div className="product-features" style={{ display: 'grid', gap: '24px', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <Truck size={20} strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>Free Shipping</p>
                  <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>On all orders within India.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <RefreshCcw size={20} strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>Easy Returns</p>
                  <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>7-day exchange protocol.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <ShieldCheck size={20} strokeWidth={1.5} />
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 700 }}>Secure Payment</p>
                  <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>Verified Razorpay Gateway.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
