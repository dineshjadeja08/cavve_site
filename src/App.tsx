import type { Session } from '@supabase/supabase-js'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import {
  ArrowRight,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
  ChevronRight
} from 'lucide-react'
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import {
  BrowserRouter,
  Link,
  NavLink,
  Navigate,
  Outlet,
  Route,
  Routes,
  useNavigate,
  useParams,
  useLocation
} from 'react-router-dom'
import { z } from 'zod'
import { Logo } from './components/Logo'
import { ProductCard } from './components/ProductCard'
import { products, journalPosts } from './data/catalog'
import { formatInr } from './lib/utils'
import { supabase } from './lib/supabase'
import { useCommerceStore } from './store/cart'

const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] as any }
}

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as any }
}

type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  role: 'admin' | 'staff' | 'customer'
}

type OrderSummary = {
  id: string
  status: string
  total_inr: number
  razorpay_order_id: string | null
  created_at: string
  order_items?: { name: string; size: string | null; color: string | null; quantity: number; unit_price_inr: number }[]
  shipments?: { status: string; awb_code: string | null; courier_name: string | null; tracking_url: string | null }[]
}

const AuthContext = createContext<{
  session: Session | null
  profile: Profile | null
  loading: boolean
}>({ session: null, profile: null, loading: true })

function useAuthState() {
  return useContext(AuthContext)
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function loadProfile() {
      if (!supabase || !session?.user) {
        setProfile(null)
        return
      }

      const fullName =
        session.user.user_metadata?.full_name ??
        session.user.user_metadata?.name ??
        session.user.email?.split('@')[0] ??
        'CAVVE customer'

      await supabase.from('profiles').upsert({
        id: session.user.id,
        full_name: fullName,
        phone: session.user.phone,
      })

      const { data } = await supabase
        .from('profiles')
        .select('id, full_name, phone, role')
        .eq('id', session.user.id)
        .single()

      setProfile((data as Profile | null) ?? null)
    }

    loadProfile()
  }, [session])

  const value = useMemo(() => ({ session, profile, loading }), [session, profile, loading])
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}


function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const cartCount = useCommerceStore((state) => state.cart.reduce((sum, item) => sum + item.quantity, 0))
  const wishlistCount = useCommerceStore((state) => state.wishlist.length)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="app-layout">
      <header className="site-header">
        <Link to="/" className="brand-link">
          <Logo />
        </Link>
        
        <nav className="desktop-nav">
          <NavLink to="/collections">Collections</NavLink>
          <NavLink to="/drop">Drop 001</NavLink>
          <NavLink to="/journal">Journal</NavLink>
          <NavLink to="/about">Manifesto</NavLink>
        </nav>

        <div className="header-actions">
          <Link className="icon-button" to="/search" aria-label="Search"><Search size={18} /></Link>
          <Link className="icon-button with-badge" to="/wishlist" aria-label="Wishlist">
            <Heart size={18} />
            {wishlistCount > 0 && <span>{wishlistCount}</span>}
          </Link>
          <Link className="icon-button with-badge" to="/cart" aria-label="Cart">
            <ShoppingBag size={18} />
            {cartCount > 0 && <span>{cartCount}</span>}
          </Link>
          <Link className="icon-button" to="/account" aria-label="Account"><User size={18} /></Link>
          <button className="icon-button mobile-only" onClick={() => setMenuOpen(true)}><Menu size={20} /></button>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            className="mobile-menu"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 200, background: 'var(--bg)', 
              display: 'flex', flexDirection: 'column', padding: '40px' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '80px' }}>
              <Logo />
              <button onClick={() => setMenuOpen(false)}><X size={32} /></button>
            </div>
            <nav style={{ display: 'grid', gap: '32px' }}>
              <Link to="/collections" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Collections</Link>
              <Link to="/drop" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>The Drop</Link>
              <Link to="/journal" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Journal</Link>
              <Link to="/about" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Manifesto</Link>
              <Link to="/account" style={{ fontSize: '32px', fontWeight: 700, textTransform: 'uppercase' }}>Account</Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <AnimatePresence mode="wait">
          <Outlet key={pathname} />
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-main">
        <div>
          <span className="footer-logo">CAVVE</span>
          <p style={{ maxWidth: '300px', color: 'var(--secondary)', marginBottom: '32px' }}>
            Minimal menswear for disciplined days. Built in heavyweight cotton, shipped from India.
          </p>
          <div className="newsletter">
            <p className="eyebrow" style={{ marginBottom: '12px' }}>Join the system</p>
            <form className="newsletter-form">
              <input type="email" placeholder="Email address" />
              <button type="submit"><ChevronRight size={20} /></button>
            </form>
          </div>
        </div>
        
        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>Shop</p>
          <nav style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
            <Link to="/collections">Collections</Link>
            <Link to="/drop">Drop 001</Link>
            <Link to="/search">Search</Link>
            <Link to="/wishlist">Wishlist</Link>
          </nav>
        </div>

        <div>
          <p className="eyebrow" style={{ marginBottom: '24px' }}>Support</p>
          <nav style={{ display: 'grid', gap: '12px', fontSize: '14px' }}>
            <Link to="/order-tracking">Track Order</Link>
            <Link to="/account">Returns</Link>
            <Link to="/about">Shipping Policy</Link>
            <Link to="/contact">Contact</Link>
          </nav>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2024 CAVVE India. All rights reserved.</p>
        <div style={{ display: 'flex', gap: '24px' }}>
          <span>Instagram</span>
          <span>Twitter</span>
          <span>LinkedIn</span>
        </div>
      </div>
    </footer>
  )
}

function HomePage() {
  useEffect(() => {
    // Advanced text reveal animation
    const tl = gsap.timeline();
    tl.fromTo('.reveal-line span', 
      { y: '100%' }, 
      { y: 0, stagger: 0.15, duration: 1.2, ease: 'power4.out', delay: 0.2 }
    );
    tl.fromTo('.hero-fade-in',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' },
      '-=0.8'
    );
  }, [])

  return (
    <motion.div {...pageTransition}>
      <section className="hero-section">
        <div className="hero-image" />
        <div className="hero-content">
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
          <p style={{ fontSize: '20px', color: 'var(--secondary)', marginBottom: '60px' }}>
            We spent 8 months sourcing the exact 240 GSM open-end cotton that holds its structure 
            through every challenge. No shrinkage. No noise. Just pure form.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '16px' }}>Strength</h4>
              <p style={{ fontSize: '14px' }}>Durable 240 GSM weave built for daily repetition.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '16px' }}>Structure</h4>
              <p style={{ fontSize: '14px' }}>Dropped shoulders that maintain their silhouette.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: '16px' }}>Stability</h4>
              <p style={{ fontSize: '14px' }}>Pre-shrunk and bio-washed for consistent fit.</p>
            </div>
          </div>
        </motion.div>
      </section>

      <section className="section-padding">
        <div className="section-grid">
          <motion.div {...fadeUp} className="section-heading">
            <span className="eyebrow">Featured Drop</span>
            <h2>Three colors. Zero noise.</h2>
            <p style={{ maxWidth: '400px', marginTop: '24px' }}>
              Jet Black, Stone Beige, and Soft White form a tight uniform system for those who build, ship, and repeat.
            </p>
            <Link to="/collections" className="text-link" style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
              View all products <ChevronRight size={16} />
            </Link>
          </motion.div>
          <div className="product-grid">
            {products.map((product) => <ProductCard product={product} key={product.id} />)}
          </div>
        </div>
      </section>

      <section className="editorial-band">
        <div className="editorial-photo" />
        <div className="editorial-content">
          <motion.div {...fadeUp}>
            <span className="eyebrow">The Philosophy</span>
            <h2>Luxury with a lower voice.</h2>
            <p style={{ fontSize: '18px', color: 'rgba(0,0,0,0.6)', marginBottom: '40px' }}>
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
                <p>{post.date}</p>
                <h3 style={{ marginTop: '12px' }}>{post.title}</h3>
              </div>
              <p style={{ color: 'var(--secondary)', fontSize: '14px', textTransform: 'none', letterSpacing: 0 }}>{post.excerpt}</p>
              <Link to="/journal" className="text-link" style={{ marginTop: '24px' }}>Read article <ArrowRight size={14} /></Link>
            </motion.article>
          ))}
        </div>
      </section>
    </motion.div>
  )
}

function CollectionsPage() {
  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <div className="section-heading" style={{ marginBottom: '80px' }}>
        <span className="eyebrow">CAVVE Launch 001</span>
        <h1>BUILT FOR AMBITION</h1>
        <p style={{ maxWidth: '600px', fontSize: '20px', marginTop: '24px' }}>
          Three oversized tees. 240 GSM heavyweight cotton. No noise.
        </p>
      </div>
      <div className="product-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))' }}>
        {products.map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </motion.div>
  )
}

function ProductPage() {
  const { slug } = useParams()
  const product = products.find((item) => item.slug === slug) ?? products[0]
  const [size, setSize] = useState('M')
  const { addToCart, toggleWishlist, wishlist } = useCommerceStore()
  const saved = wishlist.includes(product.id)

  return (
    <motion.div {...pageTransition} className="section-padding pdp">
      <div className="gallery">
        {product.gallery.map((image, i) => (
          <motion.img 
            key={image} 
            src={image} 
            alt={product.name}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          />
        ))}
      </div>
      <aside className="purchase-panel">
        <span className="eyebrow">{product.gsm} / {product.fit}</span>
        <h1>{product.name}</h1>
        <p style={{ fontSize: '18px', color: 'var(--secondary)', marginBottom: '32px' }}>{product.copy}</p>
        <strong>{formatInr(product.price)}</strong>
        
        <div style={{ margin: '40px 0' }}>
          <p className="eyebrow" style={{ fontSize: '10px', marginBottom: '16px' }}>Select Size</p>
          <div className="size-grid">
            {product.sizes.map((item) => (
              <button 
                className={size === item ? 'selected' : ''} 
                onClick={() => setSize(item)} 
                key={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <button className="primary-button wide" onClick={() => addToCart(product, size)}>Add to cart</button>
          <button className="secondary-button wide" onClick={() => toggleWishlist(product.id)}>
            <Heart size={18} fill={saved ? 'var(--primary)' : 'none'} style={{ marginRight: '8px' }} /> 
            {saved ? 'In Wishlist' : 'Add to Wishlist'}
          </button>
        </div>

        <div style={{ marginTop: '60px' }}>
          {['Details', 'Fit Guide', 'Shipping'].map((title, index) => (
            <details className="accordion" key={title} open={index === 0}>
              <summary>{title}</summary>
              <div style={{ padding: '20px 0', fontSize: '14px', color: 'var(--secondary)', lineHeight: 1.8 }}>
                {index === 0 ? product.details.join('. ') : index === 1 ? 'Designed for a relaxed oversized fall. We recommend taking your usual size for the intended look.' : 'Ships within 48 hours. Paid order tracking with measured status updates.'}
              </div>
            </details>
          ))}
        </div>
      </aside>
    </motion.div>
  )
}

function CartPage() {
  const { cart, updateQuantity, removeFromCart } = useCommerceStore()
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <h1 style={{ marginBottom: '60px' }}>Your Bag</h1>
      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p className="eyebrow">Your bag is disciplined (empty).</p>
          <Link className="primary-button" to="/collections" style={{ marginTop: '32px' }}>Shop the drop</Link>
        </div>
      ) : (
        <div className="cart-layout" style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '80px' }}>
          <div style={{ display: 'grid', gap: '2px', background: 'var(--border)' }}>
            {cart.map((item) => (
              <article key={`${item.product.id}-${item.size}`} style={{ display: 'grid', gridTemplateColumns: '160px 1fr auto', gap: '40px', padding: '40px 0', background: 'var(--bg)' }}>
                <img src={item.product.gallery[0]} alt={item.product.name} style={{ width: '160px', aspectRatio: '4/5', objectFit: 'cover' }} />
                <div>
                  <h3 style={{ fontSize: '20px', marginBottom: '8px' }}>{item.product.name}</h3>
                  <p className="eyebrow" style={{ fontSize: '10px' }}>Size: {item.size}</p>
                  <button 
                    onClick={() => removeFromCart(item.product.id, item.size)}
                    style={{ color: 'var(--accent)', fontSize: '12px', marginTop: '20px', fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ fontWeight: 700, marginBottom: '20px' }}>{formatInr(item.product.price * item.quantity)}</p>
                  <input 
                    type="number" 
                    min="1" 
                    value={item.quantity} 
                    onChange={(e) => updateQuantity(item.product.id, item.size, Number(e.target.value))}
                    style={{ width: '60px', textAlign: 'center' }}
                  />
                </div>
              </article>
            ))}
          </div>
          <aside>
            <div style={{ background: 'var(--surface)', padding: '40px', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Summary</h2>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span>Subtotal</span>
                <span>{formatInr(subtotal)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '40px', color: 'var(--secondary)', fontSize: '14px' }}>
                <span>Shipping</span>
                <span>Calculated at next step</span>
              </div>
              <Link className="primary-button wide" to="/checkout">Checkout</Link>
              <p style={{ marginTop: '24px', fontSize: '12px', color: 'var(--secondary)', textAlign: 'center' }}>
                Secure checkout with Razorpay.
              </p>
            </div>
          </aside>
        </div>
      )}
    </motion.div>
  )
}

const checkoutSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  address: z.string().min(10),
  city: z.string().min(2),
  pincode: z.string().min(6),
})

function CheckoutPage() {
  const { cart, clearCart } = useCommerceStore()
  const navigate = useNavigate()
  const { session } = useAuthState()
  const [checkoutError, setCheckoutError] = useState('')
  const [isPaying, setIsPaying] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(checkoutSchema) })
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

  async function onSubmit(values: z.infer<typeof checkoutSchema>) {
    setCheckoutError('')
    if (!session) {
      setCheckoutError('Sign in or create an account before checkout.')
      return
    }
    if (cart.length === 0) {
      setCheckoutError('Your cart is empty.')
      return
    }

    setIsPaying(true)
    const checkout = await fetch(`${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8787'}/api/payments/create-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ customer: values, items: cart, amount: subtotal }),
    })

    if (!checkout.ok) {
      const body = await checkout.json().catch(() => null)
      setCheckoutError(body?.error ?? 'Could not create payment order.')
      setIsPaying(false)
      return
    }

    const order = await checkout.json()
    const ready = await loadRazorpay()
    if (!ready || !window.Razorpay) {
      setCheckoutError('Razorpay checkout could not be loaded.')
      setIsPaying(false)
      return
    }

    const razorpay = new window.Razorpay({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      name: 'CAVVE',
      description: 'WEAR DISCIPLINE',
      order_id: order.orderId,
      prefill: {
        name: values.name,
        email: values.email,
        contact: values.phone,
      },
      theme: { color: '#0D0D0D' },
      handler: async (response) => {
        const verification = await fetch(`${import.meta.env.VITE_BACKEND_API_URL ?? 'http://localhost:8787'}/api/payments/verify`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ ...response, appOrderId: order.appOrderId }),
        })

        if (!verification.ok) {
          const body = await verification.json().catch(() => null)
          setCheckoutError(body?.error ?? 'Payment verification failed.')
          setIsPaying(false)
          return
        }

        clearCart()
        navigate(`/checkout/success?order=${order.appOrderId}`)
      },
      modal: {
        ondismiss: () => setIsPaying(false),
      },
    })

    razorpay.open()
  }

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '80px' }}>
        <div>
          <h1 style={{ marginBottom: '40px' }}>Checkout</h1>
          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '24px' }}>
            {checkoutError && <p className="notice" style={{ color: 'var(--accent)' }}>{checkoutError}</p>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <label>Name <input {...register('name')} /> {errors.name && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Required</span>}</label>
              <label>Email <input {...register('email')} /> {errors.email && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Invalid</span>}</label>
            </div>
            <label>Phone <input {...register('phone')} /> {errors.phone && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Required</span>}</label>
            <label>Address <input {...register('address')} /> {errors.address && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Required</span>}</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <label>City <input {...register('city')} /> {errors.city && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Required</span>}</label>
              <label>Pincode <input {...register('pincode')} /> {errors.pincode && <span style={{ color: 'var(--accent)', fontSize: '10px' }}>Required</span>}</label>
            </div>
            <button className="primary-button wide" type="submit" disabled={isPaying} style={{ marginTop: '24px' }}>
              {isPaying ? 'Processing...' : 'Complete Payment'}
            </button>
          </form>
        </div>
        <aside>
          <div style={{ background: 'var(--surface)', padding: '40px', border: '1px solid var(--border)' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '32px' }}>Order Summary</h2>
            <div style={{ display: 'grid', gap: '16px', marginBottom: '32px' }}>
              {cart.map(item => (
                <div key={item.product.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span>{item.product.name} x {item.quantity}</span>
                  <span>{formatInr(item.product.price * item.quantity)}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '24px', borderTop: '1px solid var(--border)' }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 700 }}>{formatInr(subtotal)}</span>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  )
}

function loadRazorpay() {
  if (window.Razorpay) return Promise.resolve(true)
  return new Promise<boolean>((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

function SearchPage() {
  const [query, setQuery] = useState('')
  const results = products.filter((product) => product.name.toLowerCase().includes(query.toLowerCase()))
  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <h1>Search</h1>
      <div className="search-box">
        <Search size={32} />
        <input 
          autoFocus 
          value={query} 
          onChange={(e) => setQuery(e.target.value)} 
          placeholder="Oversized tees, colors, fits..." 
        />
      </div>
      <div className="product-grid" style={{ marginTop: '60px' }}>
        {(query ? results : products).map((product) => <ProductCard product={product} key={product.id} />)}
      </div>
    </motion.div>
  )
}

function WishlistPage() {
  const wishlist = useCommerceStore((state) => state.wishlist)
  const saved = products.filter((product) => wishlist.includes(product.id))
  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <h1 style={{ marginBottom: '60px' }}>Saved Pieces</h1>
      {saved.length ? (
        <div className="product-grid">
          {saved.map((product) => <ProductCard product={product} key={product.id} />)}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
          <p className="eyebrow">No saved pieces yet.</p>
          <Link className="primary-button" to="/collections" style={{ marginTop: '32px' }}>Explore collection</Link>
        </div>
      )}
    </motion.div>
  )
}

function AccountPage() {
  const { session, profile } = useAuthState()
  const [orders, setOrders] = useState<OrderSummary[]>([])

  useEffect(() => {
    async function loadOrders() {
      if (!supabase || !session) {
        setOrders([])
        return
      }
      const { data } = await supabase
        .from('orders')
        .select('id, status, total_inr, razorpay_order_id, created_at, order_items(name, size, color, quantity, unit_price_inr), shipments(status, awb_code, courier_name, tracking_url)')
        .order('created_at', { ascending: false })
      setOrders((data as OrderSummary[]) ?? [])
    }
    loadOrders()
  }, [session])

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'start' }}>
        <div>
          <span className="eyebrow">Account</span>
          <h1>Welcome Back</h1>
          {session ? (
            <div style={{ marginTop: '40px' }}>
              <p style={{ fontSize: '20px', marginBottom: '8px' }}>{profile?.full_name ?? session.user.email}</p>
              <p style={{ color: 'var(--secondary)', marginBottom: '32px' }}>{session.user.email}</p>
              <button className="secondary-button" onClick={() => supabase?.auth.signOut()}>Sign Out</button>
            </div>
          ) : (
            <AuthPanel />
          )}
        </div>
        <div>
          <span className="eyebrow">Recent Orders</span>
          <div style={{ marginTop: '40px', display: 'grid', gap: '2px', background: 'var(--border)' }}>
            {orders.length === 0 ? (
              <div style={{ padding: '40px', background: 'var(--bg)', textAlign: 'center' }}>
                <p style={{ color: 'var(--secondary)' }}>No orders yet.</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} style={{ padding: '32px', background: 'var(--bg)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: 700 }}>{order.razorpay_order_id ?? order.id.slice(0, 8)}</p>
                    <p style={{ fontSize: '12px', color: 'var(--secondary)' }}>{new Date(order.created_at).toLocaleDateString()} • {order.status}</p>
                  </div>
                  <Link to={`/order-tracking?order=${order.id}`} className="text-link">Track</Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function AuthPanel() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(authSchema),
  })

  async function onSubmit(values: z.infer<typeof authSchema>) {
    if (!supabase) return
    setBusy(true)
    setMessage('')
    const response = mode === 'sign-up'
      ? await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: { data: { full_name: values.email.split('@')[0] } },
        })
      : await supabase.auth.signInWithPassword(values)
    setBusy(false)
    if (response.error) setMessage(response.error.message)
    else setMessage(mode === 'sign-up' ? 'Account created. Check email.' : 'Signed in.')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'grid', gap: '24px', marginTop: '40px' }}>
      {message && <p className="notice">{message}</p>}
      <label>Email <input type="email" {...register('email')} /> {errors.email && <span style={{ color: 'var(--accent)' }}>Required</span>}</label>
      <label>Password <input type="password" {...register('password')} /> {errors.password && <span style={{ color: 'var(--accent)' }}>Min 6 chars</span>}</label>
      <button className="primary-button wide" type="submit" disabled={busy}>{busy ? '...' : mode === 'sign-in' ? 'Sign In' : 'Create Account'}</button>
      <button 
        type="button" 
        style={{ fontSize: '12px', color: 'var(--secondary)', fontWeight: 600 }}
        onClick={() => setMode(mode === 'sign-in' ? 'sign-up' : 'sign-in')}
      >
        {mode === 'sign-in' ? "Don't have an account? Create one" : "Already have an account? Sign in"}
      </button>
    </form>
  )
}

const authSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

function JournalPage() {
  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset">
      <div className="section-heading" style={{ marginBottom: '80px' }}>
        <span className="eyebrow">The CAVVE Journal</span>
        <h1>DISCIPLINE, EDITED.</h1>
      </div>
      <div className="journal-grid">
        {journalPosts.map((post) => (
          <article key={post.title} className="journal-card">
            <div>
              <p>{post.date}</p>
              <h3 style={{ marginTop: '12px' }}>{post.title}</h3>
            </div>
            <p style={{ color: 'var(--secondary)', fontSize: '14px', textTransform: 'none', letterSpacing: 0 }}>{post.excerpt}</p>
            <Link to="/journal" className="text-link" style={{ marginTop: '24px' }}>Read article <ArrowRight size={14} /></Link>
          </article>
        ))}
      </div>
    </motion.div>
  )
}

function AboutPage() {
  return (
    <motion.div {...pageTransition}>
      <section className="section-padding page-header-offset">
        <div style={{ maxWidth: '900px' }}>
          <span className="eyebrow">The Manifesto</span>
          <h1 style={{ fontSize: 'clamp(48px, 8vw, 120px)', lineHeight: 0.9, marginBottom: '60px' }}>CONFIDENCE DOES NOT NEED VOLUME.</h1>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '80px' }}>
            <p className="eyebrow">WEAR DISCIPLINE</p>
            <div style={{ fontSize: '24px', lineHeight: 1.6, color: 'var(--secondary)' }}>
              <p style={{ marginBottom: '40px' }}>
                CAVVE makes a focused wardrobe for men who train, build, ship, present, and repeat. 
                The launch begins with three oversized tees because restraint is a feature.
              </p>
              <p>
                We believe in the power of the uniform. Fewer decisions, better materials, 
                and a silhouette that commands presence without shouting.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="editorial-band">
        <div className="editorial-photo" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1492447166138-50c3889fccb1?auto=format&fit=crop&w=1200&q=90)' }} />
        <div className="editorial-content">
          <h2>Restraint is the new luxury.</h2>
        </div>
      </section>
    </motion.div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="drop" element={<HomePage />} /> {/* Placeholder for now */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

import React from 'react'
export default App
