import React, { useEffect } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { ProductCard } from '../components/ProductCard'
import { products, journalPosts } from '../data/catalog'
import { SEO } from '../components/SEO'
import heroImage from '../assets/hero.png'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any }
}

export function HomePage() {
  useEffect(() => {
    const tl = gsap.timeline();
    tl.fromTo('.reveal-line span', 
      { y: '100%' }, 
      { y: 0, stagger: 0.15, duration: 1.2, ease: 'power4.out', delay: 0.2 }
    );
    tl.fromTo('.hero-image',
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 2, ease: 'power2.out' },
      0
    );
    tl.fromTo('.hero-fade-in',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=1.5'
    );
  }, [])

  return (
    <div className="homepage-container">
      <SEO title="WEAR DISCIPLINE" description="Premium minimalist menswear. Built for ambition. Quiet luxury editorial fashion." />
      
      <section className="hero-section">
        <div 
          className="hero-image" 
          style={{ 
            backgroundImage: `url(${heroImage})`,
            zIndex: 0
          }} 
        />
        <div className="hero-content" style={{ position: 'relative', zIndex: 10 }}>
          <div className="hero-fade-in">
            <span className="eyebrow">Launch 001 / 240 GSM Cotton</span>
          </div>
          <h1 className="hero-title">
            <div className="reveal-line"><span>WEAR</span></div>
            <div className="reveal-line"><span>DISCIPLINE.</span></div>
          </h1>
          <div className="hero-fade-in">
            <p style={{ maxWidth: '600px', marginBottom: '48px' }}>
              Built for ambition. Quiet confidence in a focused palette. 
              The uniform for those who build, ship, and repeat.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/collections">Shop the collection <ArrowRight size={16} /></Link>
              <Link className="secondary-button" to="/about">The Manifesto</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker">
        <div className="ticker-content">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <span>240 GSM HEAVYWEIGHT</span>
              <span>OVERSIZED FIT</span>
              <span>DROPPED SHOULDERS</span>
              <span>PREMIUM FINISH</span>
            </React.Fragment>
          ))}
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--surface)', textAlign: 'center' }}>
        <motion.div {...fadeUp} style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <span className="eyebrow">The Fabric of Discipline</span>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 64px)', marginBottom: '40px', lineHeight: 1.1 }}>
            HEAVYWEIGHT COTTON. <br/> LIGHTWEIGHT DECISIONS.
          </h2>
          <p style={{ fontSize: '20px', color: 'var(--secondary)', marginBottom: '60px', fontWeight: 300 }}>
            We spent 8 months sourcing the exact 240 GSM open-end cotton that holds its structure 
            through every challenge. No shrinkage. No noise. Just pure form.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div className="value-prop">
              <h4 className="eyebrow" style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '16px' }}>Strength</h4>
              <p style={{ fontSize: '14px', color: 'var(--secondary)' }}>Durable 240 GSM weave built for daily repetition.</p>
            </div>
            <div className="value-prop">
              <h4 className="eyebrow" style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '16px' }}>Structure</h4>
              <p style={{ fontSize: '14px', color: 'var(--secondary)' }}>Dropped shoulders that maintain their silhouette.</p>
            </div>
            <div className="value-prop">
              <h4 className="eyebrow" style={{ fontSize: '10px', color: 'var(--accent)', marginBottom: '16px' }}>Stability</h4>
              <p style={{ fontSize: '14px', color: 'var(--secondary)' }}>Pre-shrunk and bio-washed for consistent fit.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="section-grid">
          <motion.div {...fadeUp} className="section-heading">
            <span className="eyebrow">Featured Drop</span>
            <h2>Three colors. <br/> Zero noise.</h2>
            <p style={{ maxWidth: '400px', marginTop: '24px', color: 'var(--secondary)' }}>
              Jet Black, Stone Beige, and Soft White form a tight uniform system for those who build, ship, and repeat.
            </p>
            <Link to="/collections" className="text-link" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              View all products <ChevronRight size={16} />
            </Link>
          </motion.div>
          <div className="product-grid">
            {products.slice(0, 3).map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-photo" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90')` }} />
        <div className="editorial-content">
          <motion.div {...fadeUp}>
            <span className="eyebrow">The Philosophy</span>
            <h2>Luxury with a lower voice.</h2>
            <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.6)', marginBottom: '40px', lineHeight: 1.6 }}>
              CAVVE is built around restraint: sharper mornings, fewer decisions, better materials, and silhouettes that move from desk to street without asking for attention.
            </p>
            <Link className="primary-button" to="/about" style={{ background: 'var(--bg)', color: 'var(--primary)' }}>Read the manifesto</Link>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="section-heading" style={{ textAlign: 'center', marginBottom: '80px' }}>
          <span className="eyebrow">Journal</span>
          <h2>Discipline, edited.</h2>
        </div>
        <div className="journal-grid">
          {journalPosts.map((post) => (
            <motion.article key={post.title} className="journal-card" {...fadeUp}>
              <div>
                <p className="eyebrow" style={{ fontSize: '10px' }}>{post.date}</p>
                <h3 style={{ marginTop: '12px', fontSize: '24px' }}>{post.title}</h3>
              </div>
              <p style={{ color: 'var(--secondary)', fontSize: '15px', textTransform: 'none', letterSpacing: 0, margin: '24px 0' }}>{post.excerpt}</p>
              <Link to="/journal" className="text-link" style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Read article <ArrowRight size={14} />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="section-padding" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <span className="eyebrow">Newsletter</span>
          <h2 style={{ marginBottom: '24px' }}>Join the system.</h2>
          <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>Get early access to Drop 002 and editorial field notes.</p>
          <form className="newsletter-form" style={{ maxWidth: '500px', margin: '0 auto' }}>
            <input type="email" placeholder="Email address" style={{ background: 'var(--bg)', border: '1px solid var(--border)', padding: '18px 24px', flex: 1, color: 'var(--primary)' }} />
            <button type="submit" className="primary-button" style={{ padding: '0 32px' }}>Join</button>
          </form>
        </div>
      </section>
    </div>
  )
}
