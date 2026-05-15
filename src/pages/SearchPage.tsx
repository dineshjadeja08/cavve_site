import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search as SearchIcon, X } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { products } from '../data/catalog'
import { SEO } from '../components/SEO'

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 }
}

export function SearchPage() {
  const [query, setQuery] = useState('')
  const results = products.filter((product) => 
    product.name.toLowerCase().includes(query.toLowerCase()) ||
    product.color.toLowerCase().includes(query.toLowerCase()) ||
    product.details.some(d => d.toLowerCase().includes(query.toLowerCase()))
  )

  const popularSearches = ['Jet Black', 'Stone Beige', 'Oversized', 'Heavyweight']

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <SEO title="Search" description="Search for your favorite CAVVE pieces." />
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="eyebrow">Catalog Search</span>
          <h1 style={{ marginTop: '20px' }}>Find your uniform.</h1>
        </header>

        <div className="search-box-large">
          <SearchIcon size={24} color="var(--secondary)" strokeWidth={1.5} />
          <input 
            autoFocus 
            value={query} 
            onChange={(e) => setQuery(e.target.value)} 
            placeholder="Search products, colors, materials..." 
            aria-label="Search input"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <X size={20} />
            </button>
          )}
        </div>
        
        <div className="search-meta">
          <span style={{ opacity: 0.5 }}>Trending:</span>
          {popularSearches.map(s => (
            <button key={s} onClick={() => setQuery(s)} className="trending-tag">
              {s}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '120px' }}>
        {query ? (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <p style={{ color: 'var(--secondary)', fontSize: '14px' }}>
                Found {results.length} {results.length === 1 ? 'item' : 'items'} for "{query}"
              </p>
              {results.length > 0 && <span className="eyebrow" style={{ fontSize: '10px' }}>Scroll to explore</span>}
            </div>
            
            {results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '100px 0' }}>
                <p style={{ fontSize: '24px', color: 'var(--secondary)', marginBottom: '32px' }}>No items match your search.</p>
                <button className="secondary-button" onClick={() => setQuery('')}>Clear search</button>
              </div>
            ) : (
              <div className="product-grid">
                {results.map((product) => <ProductCard product={product} key={product.id} />)}
              </div>
            )}
          </>
        ) : (
          <>
            <div style={{ marginBottom: '40px', borderBottom: '1px solid var(--border)', paddingBottom: '20px' }}>
              <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>All Products</h2>
            </div>
            <div className="product-grid">
              {products.map((product) => <ProductCard product={product} key={product.id} />)}
            </div>
          </>
        )}
      </div>
    </motion.div>
  )
}
