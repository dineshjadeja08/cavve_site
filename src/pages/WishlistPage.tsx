import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/catalog'
import { useCommerceStore } from '../store/cart'
import { SEO } from '../components/SEO'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as any }
}

export function WishlistPage() {
  const wishlist = useCommerceStore((state) => state.wishlist)
  const saved = products.filter((product) => wishlist.includes(product.id))

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <SEO title="Saved Pieces" description="Your curated selection of CAVVE pieces." />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '80px', flexWrap: 'wrap', gap: '40px' }}>
        <div>
          <span className="eyebrow">Personal Curation</span>
          <h1 style={{ fontSize: 'clamp(32px, 5vw, 64px)', fontWeight: 800, textTransform: 'uppercase' }}>Saved Pieces</h1>
        </div>
        {saved.length > 0 && (
          <p style={{ color: 'var(--secondary)', fontWeight: 600, fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {saved.length} {saved.length === 1 ? 'Piece' : 'Pieces'} Saved
          </p>
        )}
      </div>

      {saved.length ? (
        <div className="product-grid">
          {saved.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
            <Heart size={24} color="var(--secondary)" />
          </div>
          <p className="eyebrow" style={{ color: 'var(--secondary)' }}>Your wishlist is empty.</p>
          <h2 style={{ margin: '24px 0' }}>Save pieces for later.</h2>
          <Link className="primary-button" to="/collections" style={{ margin: '0 auto' }}>Explore collection</Link>
        </div>
      )}
    </motion.div>
  )
}
