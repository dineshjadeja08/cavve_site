import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { SEO } from '../components/SEO'
import { journalPosts } from '../data/catalog'

export function JournalPage() {
  return (
    <div className="journal-page page-header-offset">
      <SEO title="Journal | CAVVE" description="Editorial insights into the protocol of discipline and design." />

      <section className="section-padding" style={{ paddingBottom: '40px' }}>
        <header style={{ marginBottom: '80px', textAlign: 'center' }}>
          <span className="eyebrow">The Editorial</span>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', lineHeight: 0.9 }}>Field Notes</h1>
        </header>

        <div className="journal-grid" style={{ display: 'grid', gap: '120px' }}>
          {journalPosts.map((post, i) => (
            <motion.article 
              key={post.title}
              className="journal-entry"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: i * 0.1 }}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: i % 2 === 0 ? '1fr 1.2fr' : '1.2fr 1fr', 
                gap: '80px', 
                alignItems: 'center' 
              }}
            >
              {i % 2 !== 0 && (
                <div style={{ order: 1 }}>
                   <div style={{ background: 'var(--surface)', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img 
                      src={i === 1 ? "https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=1200&q=80"} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
              
              <div style={{ order: i % 2 === 0 ? 1 : 2 }}>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '24px' }}>
                  <span className="eyebrow" style={{ marginBottom: 0 }}>{post.date}</span>
                  <span style={{ fontSize: '11px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={12} /> 4 min read
                  </span>
                </div>
                <h2 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '24px' }}>{post.title}</h2>
                <p style={{ fontSize: '18px', color: 'var(--secondary)', lineHeight: 1.8, marginBottom: '40px', maxWidth: '500px' }}>
                  {post.excerpt}
                </p>
                <Link to={`/journal`} className="text-link">
                  Read Protocol <ArrowRight size={14} />
                </Link>
              </div>

              {i % 2 === 0 && (
                <div style={{ order: 2 }}>
                  <div style={{ background: 'var(--surface)', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img 
                      src={i === 0 ? "https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=1200&q=80" : "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?auto=format&fit=crop&w=1200&q=80"} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="section-padding" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <span className="eyebrow">Intelligence</span>
          <h2 style={{ fontSize: '40px', marginBottom: '24px' }}>Stay Disciplined.</h2>
          <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>Receive editorial updates and early access notifications directly to your terminal.</p>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: '12px' }}>
            <input 
              type="email" 
              placeholder="email@example.com" 
              style={{ flex: 1, padding: '20px', border: '1px solid var(--border)', fontSize: '14px' }} 
            />
            <button className="primary-button">Join</button>
          </form>
        </div>
      </section>
    </div>
  )
}
