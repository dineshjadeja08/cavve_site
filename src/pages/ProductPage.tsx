import { useState } from 'react'
import { motion } from 'framer-motion'
import { useParams, Link } from 'react-router-dom'
import { Heart, Truck, RefreshCcw, ShieldCheck, ArrowLeft } from 'lucide-react'
import { products } from '../data/catalog'
import { formatInr } from '../lib/utils'
import { useCommerceStore } from '../store/cart'
import { SEO } from '../components/SEO'
import { ProductCard } from '../components/ProductCard'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as any }
}

export function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug)
  
  if (!product) {
    return (
      <div className="section-padding page-header-offset" style={{ textAlign: 'center' }}>
        <h1>Product not found</h1>
        <Link to="/collections" className="primary-button" style={{ margin: '40px auto' }}>Back to collections</Link>
      </div>
    )
  }

  const [selectedSize, setSelectedSize] = useState('M')
  const { addToCart, toggleWishlist, wishlist } = useCommerceStore()
  const saved = wishlist.includes(product.id)
  
  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 3)

  return (
    <motion.div {...pageTransition} className="section-padding pdp page-header-offset">
      <SEO 
        title={product.name} 
        description={`${product.copy} ${product.details.join(', ')}`} 
        image={product.gallery[0]}
      />
      
      <div className="pdp-container">
        <Link to="/collections" className="back-link">
          <ArrowLeft size={16} /> Back to collections
        </Link>

        <div className="pdp-layout">
          <div className="gallery-section">
            <div className="gallery">
              {product.gallery.map((image, i) => (
                <motion.div 
                  key={image} 
                  className="gallery-item"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <img src={image} alt={`${product.name} - View ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
                </motion.div>
              ))}
            </div>
          </div>

          <aside className="purchase-panel">
            <div className="pdp-meta">
              <span className="eyebrow">{product.gsm} Heavyweight / {product.fit} Fit</span>
              <h1>{product.name}</h1>
              <div className="price-row">
                <span className="price">{formatInr(product.price)}</span>
                {product.compareAt && <span className="compare-at">{formatInr(product.compareAt)}</span>}
              </div>
            </div>

            <p className="pdp-copy">{product.copy}</p>
            
            <div className="selector-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p className="eyebrow" style={{ fontSize: '10px', margin: 0 }}>Select Size</p>
                <button className="text-link" style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Size Guide</button>
              </div>
              <div className="size-grid">
                {product.sizes.map((item) => (
                  <button 
                    key={item}
                    className={selectedSize === item ? 'selected' : ''} 
                    onClick={() => setSelectedSize(item)} 
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="pdp-actions">
              <button 
                className="primary-button wide add-to-cart" 
                onClick={() => addToCart(product, selectedSize)}
              >
                Add to bag
              </button>
              <button 
                className={`secondary-button wide wishlist-btn ${saved ? 'active' : ''}`} 
                onClick={() => toggleWishlist(product.id)}
              >
                <Heart size={18} fill={saved ? 'var(--accent)' : 'none'} stroke={saved ? 'var(--accent)' : 'currentColor'} /> 
                {saved ? 'Saved to wishlist' : 'Save to wishlist'}
              </button>
            </div>

            <div className="trust-signals">
              <div className="signal">
                <Truck size={18} />
                <div>
                  <p>Fast Shipping</p>
                  <span>Free on orders above ₹5000</span>
                </div>
              </div>
              <div className="signal">
                <RefreshCcw size={18} />
                <div>
                  <p>Easy Returns</p>
                  <span>7-day return policy</span>
                </div>
              </div>
              <div className="signal">
                <ShieldCheck size={18} />
                <div>
                  <p>Secure Checkout</p>
                  <span>PCI-DSS compliant payments</span>
                </div>
              </div>
            </div>

            <div className="details-accordions">
              <details className="accordion" open>
                <summary>Description & Materials</summary>
                <div className="accordion-content">
                  <p>A cornerstone of the CAVVE uniform. This tee is engineered from our signature 240 GSM open-end cotton for a structured, architectural drape that holds its shape through countless wears.</p>
                  <ul>
                    {product.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                    <li>100% Cotton</li>
                    <li>Pre-shrunk & Bio-washed</li>
                  </ul>
                </div>
              </details>
              <details className="accordion">
                <summary>Fit & Sizing</summary>
                <div className="accordion-content">
                  <p>Oversized fit with dropped shoulders. We recommend taking your usual size for the intended silhouette. Model is 6'1" wearing size L.</p>
                </div>
              </details>
              <details className="accordion">
                <summary>Care Instructions</summary>
                <div className="accordion-content">
                  <p>Machine wash cold, inside out. Hang dry to preserve structure and color depth. Do not iron directly on print.</p>
                </div>
              </details>
            </div>
          </aside>
        </div>

        <section className="pdp-reviews section-padding">
          <div className="section-header">
            <span className="eyebrow">Feedback</span>
            <h2>Discipline in detail</h2>
          </div>
          <div className="reviews-grid">
            {[
              { name: 'Marcus T.', rating: 5, comment: 'The best heavyweight tee I\'ve owned. Holds its shape after 10+ washes.', date: '2 weeks ago' },
              { name: 'David K.', rating: 5, comment: 'Perfect oversized fit. Not too boxy, just right. The fabric feel is insane.', date: '1 month ago' },
              { name: 'Arjun R.', rating: 4, comment: 'Solid quality. Would love to see more colors in Drop 002.', date: '3 weeks ago' }
            ].map((review, i) => (
              <div key={i} className="review-card">
                <div className="review-header">
                  <div className="stars">{'★'.repeat(review.rating)}</div>
                  <span className="review-date">{review.date}</span>
                </div>
                <p className="review-comment">{review.comment}</p>
                <p className="review-author">{review.name} — Verified Purchase</p>
              </div>
            ))}
          </div>
        </section>

        <section className="related-products">
          <div className="section-heading">
            <span className="eyebrow">Complete the uniform</span>
            <h2>You might also like</h2>
          </div>
          <div className="product-grid">
            {relatedProducts.map(p => <ProductCard product={p} key={p.id} />)}
          </div>
        </section>
      </div>
    </motion.div>
  )
}
