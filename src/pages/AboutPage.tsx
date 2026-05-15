import { motion } from 'framer-motion'
import { SEO } from '../components/SEO'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any }
}

export function AboutPage() {
  return (
    <div className="section-padding page-header-offset">
      <SEO title="Manifesto" description="The CAVVE philosophy. Wear discipline. Built for ambition." />
      
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <motion.span {...fadeUp} className="eyebrow">The Manifesto</motion.span>
        <motion.h1 
          {...fadeUp}
          style={{ fontSize: 'clamp(48px, 10vw, 120px)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 0.9, letterSpacing: '-0.04em', margin: '40px 0' }}
        >
          WEAR <br/> DISCIPLINE.
        </motion.h1>

        <div className="editorial-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginTop: '100px' }}>
          <motion.div {...fadeUp}>
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>The Philosophy of Restraint</h2>
            <p style={{ fontSize: '18px', color: 'var(--secondary)', lineHeight: 1.6, fontWeight: 300 }}>
              CAVVE was born from a simple observation: the most ambitious people we know don't have time for noise. 
              They need a uniform that works as hard as they do, without asking for attention.
              <br/><br/>
              We don't do collections. We do drops of focused essentials. Each piece is a tool for your daily repetition.
            </p>
          </motion.div>
          <motion.div {...fadeUp} style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?auto=format&fit=crop&w=800&q=90" 
              alt="Editorial fashion" 
              style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover' }}
            />
          </motion.div>
        </div>

        <section id="fabric" style={{ marginTop: '160px' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
            <span className="eyebrow">The Material</span>
            <h2 style={{ fontSize: '48px', margin: '32px 0' }}>240 GSM Open-End Cotton</h2>
            <p style={{ fontSize: '20px', color: 'var(--secondary)', lineHeight: 1.6 }}>
              We spent months finding the right weight. 240 GSM provides the "architectural" drape 
              that maintains its silhouette even after 18 hours of wear. It's pre-shrunk, bio-washed, 
              and built for the long game.
            </p>
          </motion.div>
        </section>

        <section id="discipline" style={{ marginTop: '160px', padding: '100px', background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <motion.div {...fadeUp} style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '32px', fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontWeight: 400 }}>
              "Discipline is the bridge between goals and accomplishment."
            </h2>
            <p style={{ marginTop: '32px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', fontSize: '12px' }}>
              — The CAVVE Protocol
            </p>
          </motion.div>
        </section>
      </div>
    </div>
  )
}
