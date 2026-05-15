import { motion } from 'framer-motion'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/catalog'
import { SEO } from '../components/SEO'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as any }
}

export function CollectionsPage() {
  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <SEO 
        title="Collections" 
        description="Explore the CAVVE launch collection. 240 GSM heavyweight oversized tees in Jet Black, Stone Beige, and Soft White." 
      />
      
      <div className="collection-header" style={{ marginBottom: '80px' }}>
        <span className="eyebrow">CAVVE Launch 001</span>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
          BUILT FOR <br/> AMBITION
        </h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <p style={{ maxWidth: '600px', fontSize: '18px', color: 'var(--secondary)', fontWeight: 300 }}>
            Our debut drop focuses on the essential uniform. Three oversized tees engineered from heavyweight cotton, designed to maintain their structure through daily discipline.
          </p>
          <div className="filter-sort-summary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            {products.length} Products
          </div>
        </div>
      </div>

      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {products.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </motion.div>
  )
}
