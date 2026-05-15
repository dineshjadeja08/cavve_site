import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Play, ShoppingBag } from 'lucide-react'
import { SEO } from '../components/SEO'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/catalog'

export function HomePage() {
  const featuredProducts = products.slice(0, 3)

  return (
    <div className="home-page">
      <SEO 
        title="CAVVE | Wear Discipline" 
        description="Premium minimalist menswear engineered for the ambitious. Discover our heavyweight collection." 
      />

      {/* Cinematic Hero */}
      <section className="hero-section">
        <div className="section-padding" style={{ width: '100%', position: 'relative', zIndex: 10 }}>
          <motion.div 
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            <span className="eyebrow" style={{ color: 'var(--primary)', marginBottom: '16px' }}>Protocol 001 / Launch</span>
            <h1 className="hero-title">Wear<br /><span className="serif" style={{ fontStyle: 'italic' }}>Discipline</span></h1>
            <p style={{ maxWidth: '400px', fontSize: '16px', color: 'var(--secondary)', marginBottom: '40px', lineHeight: 1.6 }}>
              A uniform for the focused. Heavyweight silhouettes engineered with clinical precision.
            </p>
            <div style={{ display: 'flex', gap: '20px' }}>
              <Link to="/collections" className="primary-button">
                Shop Collection <ArrowRight size={16} />
              </Link>
              <button className="secondary-button" style={{ border: 'none' }}>
                <Play size={16} fill="currentColor" /> Watch Film
              </button>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="hero-image-container"
          initial={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)' }}
          animate={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
          transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1], delay: 0.2 }}
        >
          <img 
            src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=1200&q=90" 
            alt="Men's Luxury Editorial" 
            className="hero-image"
          />
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="section-padding" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
          <div>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>The Manifesto</span>
            <h2 style={{ fontSize: 'clamp(40px, 5vw, 72px)', lineHeight: 1.1, marginBottom: '40px' }}>
              Restraint is the ultimate <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>sophistication</span>.
            </h2>
          </div>
          <div>
            <p style={{ fontSize: '18px', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', marginBottom: '40px' }}>
              We don't build trends. We build standards. Every seam, every gram of cotton, and every silhouette is a testament to the discipline of the modern man. 
            </p>
            <Link to="/about" className="text-link" style={{ color: 'white', borderColor: 'white' }}>
              Our Story <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products - Editorial Grid */}
      <section className="section-padding">
        <header style={{ marginBottom: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <span className="eyebrow">The Catalog</span>
            <h2 style={{ fontSize: '48px' }}>Core Repetitions</h2>
          </div>
          <Link to="/collections" className="text-link">View All <ArrowRight size={14} /></Link>
        </header>

        <div className="product-grid">
          {featuredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Full Width Callout */}
      <section style={{ height: '80vh', position: 'relative', overflow: 'hidden' }}>
        <img 
          src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=2000&q=90" 
          alt="Men's Minimalist Fashion"
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', color: 'white' }}>
          <div style={{ padding: '0 5%' }}>
            <h2 style={{ fontSize: 'clamp(40px, 6vw, 100px)', marginBottom: '40px' }}>DROP 001 IS LIVE</h2>
            <Link to="/collections" className="primary-button" style={{ background: 'white', color: 'black' }}>
              Secure Your Uniform <ShoppingBag size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
