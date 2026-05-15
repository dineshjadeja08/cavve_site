import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { journalPosts } from '../data/catalog'
import { SEO } from '../components/SEO'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any }
}

export function JournalPage() {
  return (
    <div className="section-padding page-header-offset">
      <SEO title="Journal" description="Editorial field notes on discipline, design, and restraint." />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '100px' }}>
          <span className="eyebrow">Field Notes</span>
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 100px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em' }}>
            THE <br/> JOURNAL
          </h1>
        </div>

        <div className="journal-list" style={{ display: 'grid', gap: '80px' }}>
          {journalPosts.map((post, i) => (
            <motion.article 
              key={post.title} 
              {...fadeUp}
              style={{ 
                display: 'grid', 
                gridTemplateColumns: '1.5fr 1fr', 
                gap: '80px', 
                paddingBottom: '80px', 
                borderBottom: '1px solid var(--border)',
                alignItems: 'center'
              }}
            >
              <div style={{ order: i % 2 === 0 ? 0 : 1 }}>
                <span className="eyebrow" style={{ fontSize: '10px' }}>{post.date}</span>
                <h2 style={{ fontSize: '40px', margin: '24px 0', lineHeight: 1.1 }}>{post.title}</h2>
                <p style={{ fontSize: '18px', color: 'var(--secondary)', marginBottom: '40px', lineHeight: 1.6, fontWeight: 300 }}>
                  {post.excerpt} In this editorial, we dive deep into the intersection of functional design 
                  and the focused mind. We explore why restraint is the ultimate luxury in a world of constant noise.
                </p>
                <Link to="#" className="text-link" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontWeight: 700 }}>
                  Read Full Article <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{ background: 'var(--surface)', aspectRatio: '16/9', overflow: 'hidden' }}>
                 <img 
                   src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=crop&w=800&q=80`} 
                   alt={post.title}
                   style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.8 }}
                 />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
