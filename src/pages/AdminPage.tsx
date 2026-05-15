import { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  TrendingUp, 
  ArrowUpRight, 
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react'
import { useAuthState } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { SEO } from '../components/SEO'
import { formatInr } from '../lib/utils'

type AdminStats = {
  totalOrders: number
  totalRevenue: number
  totalCustomers: number
  pendingOrders: number
}

export function AdminPage() {
  const { profile, loading } = useAuthState()
  const [stats, setStats] = useState<AdminStats>({
    totalOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    pendingOrders: 0
  })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  const isStaff = profile?.role === 'admin' || profile?.role === 'staff'

  useEffect(() => {
    if (!isStaff || !supabase) return

    async function loadAdminData() {
      // Fetch Stats
      const { data: orders } = await supabase!.from('orders').select('status, total_inr')
      const { count: customerCount } = await supabase!.from('profiles').select('*', { count: 'exact', head: true })

      if (orders) {
        const revenue = orders.reduce((sum, o) => sum + (o.status === 'paid' || o.status === 'processing' ? o.total_inr : 0), 0)
        const pending = orders.filter(o => o.status === 'pending').length
        setStats({
          totalOrders: orders.length,
          totalRevenue: revenue,
          totalCustomers: customerCount || 0,
          pendingOrders: pending
        })
      }

      // Fetch Recent Orders
      const { data: recent } = await supabase!
        .from('orders')
        .select('id, status, total_inr, created_at, profiles(full_name)')
        .order('created_at', { ascending: false })
        .limit(5)
      
      setRecentOrders(recent || [])
    }

    loadAdminData()
  }, [isStaff])

  if (loading) return <div className="section-padding page-header-offset" style={{ textAlign: 'center' }}>Verifying credentials...</div>

  if (!isStaff) {
    return (
      <div className="section-padding page-header-offset" style={{ textAlign: 'center', maxWidth: '500px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '24px' }}>Restricted Access</h1>
        <p style={{ color: 'var(--secondary)', marginBottom: '40px' }}>You do not have the required permissions to view the administration panel.</p>
        <button className="primary-button" onClick={() => window.location.href = '/'}>Return Home</button>
      </div>
    )
  }

  return (
    <div className="section-padding page-header-offset admin-layout">
      <SEO title="Admin Panel" description="CAVVE Administration Control Center" />
      
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <span className="eyebrow">CAVVE Control</span>
          <h2>Protocol</h2>
        </div>
        
        <nav className="admin-nav">
          <button className={activeTab === 'dashboard' ? 'active' : ''} onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>
            <Clock size={18} /> Orders
          </button>
          <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>
            <Package size={18} /> Catalog
          </button>
          <button className={activeTab === 'customers' ? 'active' : ''} onClick={() => setActiveTab('customers')}>
            <Users size={18} /> Customers
          </button>
          <button className={activeTab === 'settings' ? 'active' : ''} onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </button>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div>
            <h1>Overview</h1>
            <p>Real-time performance metrics.</p>
          </div>
          <div className="admin-user-pill">
            <span className="role-tag">{profile?.role}</span>
            <span>{profile?.full_name}</span>
          </div>
        </header>

        <section className="stats-grid">
          <div className="stat-card">
            <div className="stat-label">Total Revenue <TrendingUp size={12} color="#10b981" /></div>
            <div className="stat-value">{formatInr(stats.totalRevenue)}</div>
            <div className="stat-sub">+12% from last drop</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{stats.totalOrders}</div>
            <div className="stat-sub">{stats.pendingOrders} pending fulfillment</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Customers</div>
            <div className="stat-value">{stats.totalCustomers}</div>
            <div className="stat-sub">Active members</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Conversion Rate</div>
            <div className="stat-value">3.2%</div>
            <div className="stat-sub">Industry avg: 2.1%</div>
          </div>
        </section>

        <section className="admin-content-grid">
          <div className="admin-panel-card">
            <div className="panel-header">
              <h3>Recent Repetitions (Orders)</h3>
              <button className="text-link">View all <ChevronRight size={14} /></button>
            </div>
            <div className="admin-table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map(order => (
                    <tr key={order.id}>
                      <td className="mono">#{order.id.slice(0, 8)}</td>
                      <td>{order.profiles?.full_name || 'Guest'}</td>
                      <td>
                        <span className={`status-pill ${order.status}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="weight-700">{formatInr(order.total_inr)}</td>
                      <td>
                        <button className="icon-btn"><ExternalLink size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="admin-panel-card">
            <div className="panel-header">
              <h3>Performance Feed</h3>
            </div>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-icon green"><ArrowUpRight size={14} /></div>
                <div className="activity-details">
                  <p>New order received <strong>#8E53BF</strong></p>
                  <span>2 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon blue"><Users size={14} /></div>
                <div className="activity-details">
                  <p>New member joined: <strong>Viknesh B.</strong></p>
                  <span>45 minutes ago</span>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-icon orange"><Package size={14} /></div>
                <div className="activity-details">
                  <p>Stock low on <strong>Core Tee (Black / L)</strong></p>
                  <span>3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
