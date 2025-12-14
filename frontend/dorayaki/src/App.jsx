import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ShopPage from './pages/ShopPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProtectedRoute from './components/ProtectedRoute';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import SweetForm from './pages/admin/SweetForm';
import CartPage from './pages/CartPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
  return (
    <div className="app-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <ScrollToTop />
      <Navbar />
      
      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected User Routes */}
          <Route element={<ProtectedRoute />}>
             <Route path="/sweets" element={<ShopPage />} />
             <Route path="/cart" element={<CartPage />} />
          </Route>

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
             <Route path="/admin" element={<AdminDashboard />} />
             <Route path="/admin/new" element={<SweetForm />} />
             <Route path="/admin/edit/:id" element={<SweetForm />} />
          </Route>
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;
