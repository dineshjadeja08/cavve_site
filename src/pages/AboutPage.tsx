import { motion } from 'framer-motion'
import { SEO } from '../components/SEO'

export function AboutPage() {
  return (
    <div className="about-page page-header-offset">
      <SEO title="Manifesto | CAVVE" description="Our protocol. Our discipline. Our philosophy." />

      {/* Hero Header */}
      <section className="section-padding" style={{ paddingBottom: '40px' }}>
        <div style={{ textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
          <motion.span 
            className="eyebrow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            The Protocol
          </motion.span>
          <motion.h1 
            style={{ fontSize: 'clamp(40px, 8vw, 120px)', lineHeight: 0.9, marginBottom: '60px' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Architecture of <br />
            <span className="serif" style={{ fontStyle: 'italic' }}>Discipline</span>
          </motion.h1>
        </div>
      </section>

      {/* Large Image Section */}
      <section style={{ height: '80vh', overflow: 'hidden' }}>
        <motion.img 
          src="https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&w=2000&q=90" 
          alt="Men's Campaign Editorial"
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2 }}
        />
      </section>

      {/* The Vision */}
      <section className="section-padding">
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px' }}>
          <div>
            <h2 style={{ fontSize: '48px', lineHeight: 1.1, marginBottom: '40px' }}>
              We build uniforms for the <span className="serif" style={{ fontStyle: 'italic' }}>uncompromising</span>.
            </h2>
          </div>
          <div style={{ fontSize: '18px', lineHeight: 1.8, color: 'var(--secondary)' }}>
            <p style={{ marginBottom: '32px' }}>
              CAVVE was founded on a singular realization: the modern landscape is too loud. The constant noise of trends and fast fashion distracts from what truly matters—your work, your discipline, and your growth.
            </p>
            <p>
              We decided to strip away the noise. Our garments are not meant to be noticed; they are meant to be felt. They are engineered to provide a silent foundation upon which you build your legacy.
            </p>
          </div>
        </div>
      </section>

      {/* Fabric focus */}
      <section className="section-padding" style={{ background: 'var(--primary)', color: 'white' }}>
        <div className="container">
          <div style={{ maxWidth: '800px', marginBottom: '80px' }}>
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.4)' }}>The Engineering</span>
            <h2 style={{ fontSize: '64px', lineHeight: 1 }}>Surgical precision in every <span className="serif" style={{ fontStyle: 'italic', color: 'var(--accent)' }}>thread</span>.</h2>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
            <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ fontSize: '32px', marginBottom: '16px' }}>240 GSM</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>The perfect weight for structural integrity. A fabric that holds its shape through years of repetition.</p>
            </div>
            <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ fontSize: '32px', marginBottom: '16px' }}>Compact Cotton</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Premium long-staple fibers woven tightly to eliminate pilling and ensure a smooth, cool-to-touch feel.</p>
            </div>
            <div className="stat-card" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
              <h3 style={{ fontSize: '32px', marginBottom: '16px' }}>Clinical Cut</h3>
              <p style={{ fontSize: '14px', opacity: 0.7 }}>Our silhouettes are the result of 18 months of pattern refinement. Maximum range of motion with a refined drape.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Callout */}
      <section className="section-padding" style={{ textAlign: 'center' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <p className="serif" style={{ fontSize: 'clamp(32px, 5vw, 64px)', lineHeight: 1.2, fontStyle: 'italic' }}>
            "Discipline is the bridge between goals and accomplishment. Our uniform is the reminder."
          </p>
        </div>
      </section>

      {/* Split Image Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', background: 'var(--border)' }}>
        <div style={{ height: '70vh', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1200&q=90" alt="Process" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ height: '70vh', overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1516826957135-700dedea698c?auto=format&fit=crop&w=1200&q=90" alt="Detail" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </section>
    </div>
  )
}
