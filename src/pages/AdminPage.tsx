import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  TrendingUp, 
  Clock,
  ChevronRight,
  Plus,
  Trash2,
  Layers,
  CheckCircle2
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

type Collection = {
  id: string
  slug: string
  title: string
  description: string
  published: boolean
  created_at: string
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
  
  // Collections State
  const [collections, setCollections] = useState<Collection[]>([])
  const [isAddingCollection, setIsAddingCollection] = useState(false)
  const [newCollection, setNewCollection] = useState({ title: '', slug: '', description: '' })

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

      // Fetch Collections
      const { data: cols } = await supabase!.from('collections').select('*').order('created_at', { ascending: false })
      setCollections(cols || [])
    }

    loadAdminData()
  }, [isStaff])

  async function handleAddCollection() {
    if (!supabase || !newCollection.title || !newCollection.slug) return
    
    const { data, error } = await supabase
      .from('collections')
      .insert([{ ...newCollection, published: true }])
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setCollections([data, ...collections])
    setIsAddingCollection(false)
    setNewCollection({ title: '', slug: '', description: '' })
  }

  async function handleDeleteCollection(id: string) {
    if (!supabase || !confirm('Are you sure you want to delete this collection? This will not delete products but will unassign them.')) return

    const { error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)

    if (error) {
      alert(error.message)
      return
    }

    setCollections(collections.filter(c => c.id !== id))
  }

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
          <button className={activeTab === 'collections' ? 'active' : ''} onClick={() => setActiveTab('collections')}>
            <Layers size={18} /> Collections
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
        </nav>
      </aside>

      <main className="admin-main">
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="admin-header">
              <div>
                <h1>Control Center</h1>
                <p>System status and overall performance.</p>
              </div>
              <div className="admin-user-pill">
                <span className="role-tag">{profile?.role}</span>
                <span>{profile?.full_name}</span>
              </div>
            </header>

            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-label">Revenue <TrendingUp size={12} color="#10b981" /></div>
                <div className="stat-value">{formatInr(stats.totalRevenue)}</div>
                <div className="stat-sub">From {stats.totalOrders} total orders</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Processing</div>
                <div className="stat-value">{stats.pendingOrders}</div>
                <div className="stat-sub">Awaiting fulfillment</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Community</div>
                <div className="stat-value">{stats.totalCustomers}</div>
                <div className="stat-sub">Verified members</div>
              </div>
              <div className="stat-card">
                <div className="stat-label">Success Rate</div>
                <div className="stat-value">98.4%</div>
                <div className="stat-sub">Transaction integrity</div>
              </div>
            </section>

            <section className="admin-content-grid">
              <div className="admin-panel-card">
                <div className="panel-header">
                  <h3>Recent Repetitions</h3>
                  <button className="text-link" onClick={() => setActiveTab('orders')}>View all <ChevronRight size={14} /></button>
                </div>
                <div className="admin-table-wrapper">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Status</th>
                        <th>Amount</th>
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
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="panel-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="admin-quick-links">
                  <button onClick={() => { setActiveTab('collections'); setIsAddingCollection(true); }}>
                    <Layers size={14} /> New Collection
                  </button>
                  <button onClick={() => setActiveTab('products')}>
                    <Package size={14} /> Update Inventory
                  </button>
                  <button onClick={() => setActiveTab('orders')}>
                    <Clock size={14} /> Process Pending
                  </button>
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {activeTab === 'collections' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="admin-header">
              <div>
                <h1>Collections</h1>
                <p>Manage product groupings and drops.</p>
              </div>
              <button className="primary-button" onClick={() => setIsAddingCollection(true)}>
                <Plus size={16} /> New Collection
              </button>
            </header>

            {isAddingCollection && (
              <div className="admin-panel-card" style={{ marginBottom: '40px' }}>
                <div className="panel-header">
                  <h3>Define New Collection</h3>
                </div>
                <div className="admin-form">
                  <div className="form-grid">
                    <div className="field">
                      <label>Title</label>
                      <input 
                        placeholder="e.g. Drop 002: Core Repetition" 
                        value={newCollection.title}
                        onChange={e => setNewCollection({ ...newCollection, title: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                      />
                    </div>
                    <div className="field">
                      <label>Slug</label>
                      <input 
                        placeholder="drop-002" 
                        value={newCollection.slug}
                        onChange={e => setNewCollection({ ...newCollection, slug: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="field">
                    <label>Description</label>
                    <textarea 
                      placeholder="The philosophy behind this drop..." 
                      rows={3}
                      value={newCollection.description}
                      onChange={e => setNewCollection({ ...newCollection, description: e.target.value })}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                    <button className="primary-button" onClick={handleAddCollection}>Create Collection</button>
                    <button className="secondary-button" onClick={() => setIsAddingCollection(false)}>Cancel</button>
                  </div>
                </div>
              </div>
            )}

            <div className="admin-panel-card">
              <div className="admin-table-wrapper">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Slug</th>
                      <th>Products</th>
                      <th>Status</th>
                      <th>Created</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collections.map(col => (
                      <tr key={col.id}>
                        <td className="weight-700">{col.title}</td>
                        <td className="mono">{col.slug}</td>
                        <td>—</td>
                        <td>
                          <span className="status-pill paid" style={{ background: '#dcfce7', color: '#166534' }}>
                            <CheckCircle2 size={10} style={{ marginRight: '4px' }} /> Published
                          </span>
                        </td>
                        <td>{new Date(col.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="icon-btn danger" onClick={() => handleDeleteCollection(col.id)}>
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
           <div style={{ textAlign: 'center', padding: '100px 0' }}>
             <Clock size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
             <h2>Order Protocol Manager</h2>
             <p style={{ color: 'var(--secondary)' }}>Full order management module coming in the next protocol update.</p>
           </div>
        )}
        
        {activeTab === 'products' && (
           <div style={{ textAlign: 'center', padding: '100px 0' }}>
             <Package size={48} style={{ opacity: 0.1, marginBottom: '24px' }} />
             <h2>Inventory Protocol</h2>
             <p style={{ color: 'var(--secondary)' }}>Product management module coming in the next protocol update.</p>
           </div>
        )}
      </main>
    </div>
  )
}
