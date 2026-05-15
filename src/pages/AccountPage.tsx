import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogOut, Package, User, MapPin, ChevronRight, ShoppingBag } from 'lucide-react'
import { useAuthState } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { SignInForm } from '../components/SignInForm'
import { SEO } from '../components/SEO'
import { formatInr } from '../lib/utils'

export function AccountPage() {
  const { session, profile, loading } = useAuthState()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<any[]>([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    if (!session || !supabase) return

    async function fetchOrders() {
      setIsFetching(true)
      const { data, error } = await supabase!
        .from('orders')
        .select('*')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false })
      
      if (!error && data) {
        setOrders(data)
      }
      setIsFetching(false)
    }

    fetchOrders()
  }, [session])

  if (loading) return <div className="section-padding page-header-offset" style={{ textAlign: 'center' }}>Verifying credentials...</div>

  if (!session) {
    return (
      <div className="account-page page-header-offset section-padding">
        <SEO title="Sign In | CAVVE" description="Access your personal protocol and order history." />
        <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '120px', alignItems: 'center' }}>
          <div>
            <span className="eyebrow">The System</span>
            <h1 style={{ fontSize: '64px', lineHeight: 1, marginBottom: '32px' }}>Personal <span className="serif" style={{ fontStyle: 'italic' }}>Protocol</span></h1>
            <p style={{ color: 'var(--secondary)', fontSize: '16px', lineHeight: 1.8 }}>
              Access your order history, track active shipments, and manage your preferred delivery addresses. 
              Join the uniform system.
            </p>
          </div>
          <SignInForm />
        </div>
      </div>
    )
  }

  return (
    <div className="account-page page-header-offset section-padding">
      <SEO title="My Protocol | CAVVE" description="Manage your account and track orders." />
      
      <div className="account-layout">
        {/* Sidebar */}
        <aside className="account-sidebar" style={{ borderRight: '1px solid var(--border)', paddingRight: '40px' }}>
          <div style={{ marginBottom: '60px' }}>
            <h1 className="serif" style={{ fontSize: '32px', marginBottom: '8px' }}>Hello, {profile?.full_name?.split(' ')[0]}</h1>
            <p style={{ fontSize: '11px', color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Protocol Member since 2024</p>
          </div>

          <nav style={{ display: 'grid', gap: '8px' }}>
            <button 
              className={`text-link ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
              style={{ justifyContent: 'space-between', border: 'none', padding: '16px 0', width: '100%', borderBottom: activeTab === 'orders' ? '1px solid var(--primary)' : '1px solid transparent' }}
            >
              Order History <Package size={14} />
            </button>
            <button 
              className={`text-link ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
              style={{ justifyContent: 'space-between', border: 'none', padding: '16px 0', width: '100%', borderBottom: activeTab === 'profile' ? '1px solid var(--primary)' : '1px solid transparent' }}
            >
              Profile Settings <User size={14} />
            </button>
            <button 
              className={`text-link ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
              style={{ justifyContent: 'space-between', border: 'none', padding: '16px 0', width: '100%', borderBottom: activeTab === 'addresses' ? '1px solid var(--primary)' : '1px solid transparent' }}
            >
              Addresses <MapPin size={14} />
            </button>
            <button 
              className="text-link"
              onClick={() => supabase?.auth.signOut()}
              style={{ justifyContent: 'space-between', border: 'none', padding: '16px 0', width: '100%', color: 'var(--error)', borderBottom: '1px solid transparent' }}
            >
              Sign Out <LogOut size={14} />
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="account-main">
          {activeTab === 'orders' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '60px' }}>
                <h2 style={{ fontSize: '40px' }}>Recent Repetitions</h2>
                <span className="eyebrow" style={{ marginBottom: 0 }}>Showing {orders.length} protocol assignments</span>
              </div>

              {isFetching ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>Syncing order data...</div>
              ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '100px 0', border: '1px solid var(--border)', background: 'white' }}>
                  <ShoppingBag size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
                  <p style={{ color: 'var(--secondary)' }}>No protocol assignments found in your history.</p>
                  <Link to="/collections" className="text-link" style={{ marginTop: '24px' }}>Build your uniform <ChevronRight size={14} /></Link>
                </div>
              ) : (
                <div style={{ display: 'grid', gap: '24px' }}>
                  {orders.map(order => (
                    <div key={order.id} style={{ padding: '32px', border: '1px solid var(--border)', background: 'white' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <div>
                          <p className="eyebrow" style={{ marginBottom: '4px' }}>Order #{order.id.slice(0, 8).toUpperCase()}</p>
                          <p style={{ fontSize: '13px', color: 'var(--secondary)' }}>
                            {new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                          </p>
                        </div>
                        <span className={`status-pill ${order.status}`}>
                          {order.status}
                        </span>
                      </div>
                      
                      {/* Items loop - assuming order.items is an array of objects */}
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {order.items?.map((item: any, idx: number) => (
                          <div key={idx} style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
                            <div style={{ width: '60px', height: '80px', background: 'var(--surface)', overflow: 'hidden' }}>
                              <img src={item.product?.gallery?.[0]} alt={item.product?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                            <div>
                              <p style={{ fontWeight: 700, fontSize: '14px' }}>{item.product?.name} ({item.size})</p>
                              <p style={{ fontSize: '14px', color: 'var(--secondary)' }}>{formatInr(item.product?.price)} x {item.quantity}</p>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '14px', fontWeight: 700 }}>Total: {formatInr(order.total_inr)}</span>
                        <button className="text-link">View Protocol Details <ChevronRight size={14} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 style={{ fontSize: '40px', marginBottom: '60px' }}>Security Protocol</h2>
              <div className="admin-form" style={{ maxWidth: '500px' }}>
                <div className="field">
                  <label>Full Name</label>
                  <input type="text" defaultValue={profile?.full_name || ''} />
                </div>
                <div className="field">
                  <label>Email Address</label>
                  <input type="email" defaultValue={session.user.email} disabled />
                </div>
                <div className="field">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="+91 ..." defaultValue={profile?.phone || ''} />
                </div>
                <button className="primary-button">Update Identity</button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  )
}
