import { motion, AnimatePresence } from 'framer-motion'
import { useEffect } from 'react'
import {
  BrowserRouter,
  Outlet,
  Route,
  Routes,
  useLocation
} from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { MobileNav } from './components/MobileNav'
import { HomePage } from './pages/HomePage'
import { CollectionsPage } from './pages/CollectionsPage'
import { ProductPage } from './pages/ProductPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SearchPage } from './pages/SearchPage'
import { WishlistPage } from './pages/WishlistPage'
import { AccountPage } from './pages/AccountPage'
import { AboutPage } from './pages/AboutPage'
import { JournalPage } from './pages/JournalPage'
import { AdminPage } from './pages/AdminPage'

function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="app-layout">
      <Header />
      <main>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
      <MobileNav />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="collections" element={<CollectionsPage />} />
            <Route path="products/:slug" element={<ProductPage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="drop" element={<CollectionsPage />} />
            <Route path="admin" element={<AdminPage />} />
            {/* Catch all */}
            <Route path="*" element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
