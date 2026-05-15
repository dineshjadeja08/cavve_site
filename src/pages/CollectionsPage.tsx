import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter } from 'lucide-react'
import { products } from '../data/catalog'
import { ProductCard } from '../components/ProductCard'
import { SEO } from '../components/SEO'

export function CollectionsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.copy.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.fit.includes(selectedCategory)
    return matchesSearch && matchesCategory
  })

  return (
    <div className="collections-page page-header-offset">
      <SEO 
        title="Collections | CAVVE" 
        description="Browse the complete CAVVE catalog. Premium oversized tees and core essentials." 
      />

      <section className="section-padding" style={{ paddingBottom: '40px' }}>
        <header style={{ marginBottom: '60px', textAlign: 'center' }}>
          <span className="eyebrow">Protocol / 001</span>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 1 }}>Full Collection</h1>
        </header>

        {/* Dynamic Filters */}
        <div className="collection-filters" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '24px 0' }}>
          <div style={{ display: 'flex', gap: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <Filter size={16} /> Filters
            </div>
            <div className="filter-group" style={{ display: 'flex', gap: '24px' }}>
              {['All', 'Oversized', 'Standard'].map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  style={{ 
                    fontSize: '11px', 
                    fontWeight: 700, 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.1em',
                    color: selectedCategory === cat ? 'var(--primary)' : 'var(--secondary)',
                    borderBottom: selectedCategory === cat ? '1px solid var(--primary)' : '1px solid transparent'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: '0', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
            <input 
              type="text" 
              placeholder="Search repetition..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'transparent', border: 'none', borderBottom: '1px solid var(--border)', padding: '8px 8px 8px 32px', fontSize: '12px' }}
            />
          </div>
        </div>

        <div className="product-grid">
          {filteredProducts.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <p className="eyebrow">Zero results</p>
            <h2 style={{ marginBottom: '24px' }}>No matches found in this drop.</h2>
            <button className="primary-button" onClick={() => { setSearchQuery(''); setSelectedCategory('All'); }}>Clear All Filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
