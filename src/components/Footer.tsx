import { Link } from 'react-router-dom'


export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">CAVVE</Link>
          <p className="footer-tagline">WEAR DISCIPLINE</p>
          <p className="footer-desc">
            Premium minimalist menswear engineered for the ambitious. 
            Quiet luxury silouhettes in heavyweight cotton.
          </p>
          <div className="social-links">
            <a href="#" aria-label="Instagram">Instagram</a>
            <a href="#" aria-label="Twitter">Twitter</a>
            <a href="#" aria-label="LinkedIn">LinkedIn</a>
          </div>
        </div>
        
        <div className="footer-links-group">
          <div className="link-column">
            <p className="eyebrow">Shop</p>
            <nav>
              <Link to="/collections">All Products</Link>
              <Link to="/collections?category=tees">Oversized Tees</Link>
              <Link to="/drop">Drop 001</Link>
              <Link to="/wishlist">Wishlist</Link>
            </nav>
          </div>

          <div className="link-column">
            <p className="eyebrow">Manifesto</p>
            <nav>
              <Link to="/about">Our Story</Link>
              <Link to="/journal">Journal</Link>
              <Link to="/about#fabric">The Fabric</Link>
              <Link to="/about#discipline">The Discipline</Link>
            </nav>
          </div>

          <div className="link-column">
            <p className="eyebrow">Support</p>
            <nav>
              <Link to="/order-tracking">Track Order</Link>
              <Link to="/account">Returns & Exchanges</Link>
              <Link to="/about#shipping">Shipping Policy</Link>
              <Link to="/contact">Contact Support</Link>
            </nav>
          </div>
        </div>

        <div className="footer-newsletter">
          <p className="eyebrow">Join the System</p>
          <p className="newsletter-text">Subscribe for early access to Drop 002 and editorial field notes.</p>
          <form className="newsletter-form" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="email@example.com" aria-label="Email address for newsletter" />
            <button type="submit" aria-label="Subscribe">Join</button>
          </form>
          <p className="privacy-note">By subscribing, you agree to our Privacy Policy.</p>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-legal">
          <span>© 2024 CAVVE India</span>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Service</Link>
        </div>
        <div className="payment-methods">
          {/* Mock payment icons */}
          <span style={{ opacity: 0.5 }}>RAZORPAY SECURE</span>
        </div>
      </div>
    </footer>
  )
}
