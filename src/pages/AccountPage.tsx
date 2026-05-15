import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, User, LogOut, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuthState } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { SEO } from '../components/SEO'
import { SignInForm } from '../components/SignInForm'

type OrderSummary = {
  id: string
  status: string
  total_inr: number
  razorpay_order_id: string | null
  created_at: string
  order_items?: { name: string; size: string | null; color: string | null; quantity: number; unit_price_inr: number }[]
  shipments?: { status: string; awb_code: string | null; courier_name: string | null; tracking_url: string | null }[]
}

const pageTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.6 }
}

export function AccountPage() {
  const { session, profile, loading } = useAuthState()
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

  if (loading) {
    return <div className="section-padding page-header-offset" style={{ textAlign: 'center' }}>Loading account...</div>
  }

  return (
    <motion.div {...pageTransition} className="section-padding page-header-offset account-page">
      <SEO title="Account" description="Manage your CAVVE account and track your orders." />
      
      {!session ? (
        <div style={{ maxWidth: '450px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <span className="eyebrow">Members Only</span>
            <h1 style={{ marginTop: '20px' }}>Welcome to CAVVE</h1>
            <p style={{ color: 'var(--secondary)', marginTop: '24px' }}>
              Sign in to track orders, manage your wishlist, and get early access to future drops.
            </p>
          </div>
          
          <div className="auth-card">
            <SignInForm />
          </div>
        </div>
      ) : (
        <div className="account-layout">
          <aside className="account-nav">
            <div className="profile-card">
              <div className="profile-avatar">
                {profile?.full_name?.[0] || session.user.email?.[0] || <User size={24} />}
              </div>
              <div className="profile-info">
                <h3>{profile?.full_name || 'CAVVE Customer'}</h3>
                <p>{session.user.email}</p>
              </div>
            </div>
            
            <nav className="side-nav">
              <Link to="/account" className="active"><Package size={18} /> Orders</Link>
              <Link to="/wishlist"><ShoppingBag size={18} /> Wishlist</Link>
              <button onClick={() => supabase?.auth.signOut()} className="logout-btn">
                <LogOut size={18} /> Sign Out
              </button>
            </nav>
          </aside>

          <main className="account-main">
            <div className="section-header">
              <h2>Recent Orders</h2>
              <p>View and track your previous purchases.</p>
            </div>

            <div className="orders-list">
              {orders.length === 0 ? (
                <div className="empty-orders">
                  <p>You haven't placed any orders yet.</p>
                  <Link to="/collections" className="text-link">Start your collection <ChevronRight size={14} /></Link>
                </div>
              ) : (
                orders.map(order => (
                  <div key={order.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <p className="order-id">Order {order.razorpay_order_id ?? order.id.slice(0, 8)}</p>
                        <p className="order-date">{new Date(order.created_at).toLocaleDateString()} • {order.status}</p>
                      </div>
                      <Link to={`/order-tracking?order=${order.id}`} className="secondary-button" style={{ padding: '8px 16px', fontSize: '10px' }}>Track Order</Link>
                    </div>
                    <div className="order-items-preview">
                      {order.order_items?.map((item, i) => (
                        <span key={i}>{item.name} ({item.size}) {i < (order.order_items?.length || 0) - 1 ? '•' : ''} </span>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </main>
        </div>
      )}
    </motion.div>
  )
}
