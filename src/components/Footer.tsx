import { Link } from 'react-router-dom'
import { ArrowRight, Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="footer" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
      <div className="section-padding">
        <div className="footer-main" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '80px', marginBottom: '80px' }}>
          
          <div className="footer-brand">
            <Link to="/" className="logo" style={{ fontSize: '32px', marginBottom: '16px', display: 'block' }}>CAVVE</Link>
            <p className="eyebrow" style={{ marginBottom: '32px' }}>Wear Discipline</p>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', lineHeight: 1.8, maxWidth: '300px' }}>
              Engineered uniforms for the disciplined. Quiet luxury silhouettes crafted with surgical precision.
            </p>
          </div>

          <div className="footer-links">
            <p className="eyebrow">Catalog</p>
            <ul style={{ display: 'grid', gap: '12px' }}>
              <li><Link to="/collections" style={{ fontSize: '13px' }}>All Repetitions</Link></li>
              <li><Link to="/drop" style={{ fontSize: '13px' }}>Drop 001</Link></li>
              <li><Link to="/collections" style={{ fontSize: '13px' }}>The Core Tee</Link></li>
              <li><Link to="/journal" style={{ fontSize: '13px' }}>Field Notes</Link></li>
            </ul>
          </div>

          <div className="footer-links">
            <p className="eyebrow">Manifesto</p>
            <ul style={{ display: 'grid', gap: '12px' }}>
              <li><Link to="/about" style={{ fontSize: '13px' }}>Our Protocol</Link></li>
              <li><Link to="/about" style={{ fontSize: '13px' }}>Fabric Engineering</Link></li>
              <li><Link to="/about" style={{ fontSize: '13px' }}>The Discipline</Link></li>
              <li><Link to="/journal" style={{ fontSize: '13px' }}>Editorial</Link></li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <p className="eyebrow">The System</p>
            <p style={{ fontSize: '13px', color: 'var(--secondary)', marginBottom: '24px' }}>
              Join the internal protocol for early access and editorial insights.
            </p>
            <form onSubmit={(e) => e.preventDefault()} style={{ position: 'relative' }}>
              <input 
                type="email" 
                placeholder="email@example.com" 
                style={{ 
                  width: '100%', 
                  padding: '16px 0', 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid var(--border)', 
                  fontSize: '13px' 
                }} 
              />
              <button type="submit" style={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}>
                <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>

        <div className="footer-bottom" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '40px', borderTop: '1px solid var(--border)' }}>
          <div className="legal-links" style={{ display: 'flex', gap: '32px', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)' }}>
            <span>© 2024 CAVVE India</span>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
          
          <div className="social-links" style={{ display: 'flex', gap: '24px', color: 'var(--primary)' }}>
            <a href="#" aria-label="Social Link"><Mail size={18} strokeWidth={1.5} /></a>
          </div>
        </div>
      </div>
    </footer>
  )
}
