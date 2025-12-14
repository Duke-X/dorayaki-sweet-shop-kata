import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation(); // Import useLocation
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isHome = location.pathname === '/';
  const textColor = isHome ? '#fff' : 'var(--color-teal)';
  const shadowColor = isHome ? '0 1px 2px rgba(0,0,0,0.5)' : 'none';
  const logoColor = isHome ? '#fff' : 'var(--color-saffron)';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 1000,
      background: 'var(--glass-bg)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid var(--glass-border)',
      boxShadow: 'var(--glass-shadow)',
    }}>
      <div className="container" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem 0', 
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Link to="/" style={{ 
            fontFamily: 'var(--font-heading)', 
            fontSize: '1.8rem', 
            fontWeight: '700',
            color: logoColor, 
            textShadow: isHome ? '0 2px 4px rgba(0,0,0,0.3)' : 'none',
            letterSpacing: '1px'
          }}>
            DORAYAKI
          </Link>
        </div>

        {/* Desktop Menu */}
        <div className="desktop-menu" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {user && user.isAdmin ? (
               <Link to="/admin" style={{ color: 'var(--color-saffron)', fontWeight: 'bold', fontSize: '1.1rem' }}>Admin Panel</Link>
          ) : (
             <>
                <Link to="/about" className="nav-link" style={{ color: textColor, fontWeight: '500', textShadow: shadowColor }}>Journey</Link>
                <Link to="/sweets" className="nav-link" style={{ color: textColor, fontWeight: '500', textShadow: shadowColor }}>Sweets Collection</Link>
                <Link to="/cart" className="nav-link" style={{ color: textColor, fontWeight: '500', textShadow: shadowColor, display: 'flex', alignItems: 'center', gap: '5px' }}>
                    Bag ({totalItems})
                </Link>
             </>
          )}
          
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
               <span style={{ fontSize: '0.9rem', color: textColor }}>Hello</span>
               <button onClick={handleLogout} className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', border: `1px solid ${textColor}`, color: textColor }}>
                 Logout
               </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/login" style={{ fontWeight: '600', color: textColor, textShadow: shadowColor }}>Login</Link>
              <Link to="/register" className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', backgroundColor: isHome ? '#fff' : 'var(--color-teal)', color: isHome ? 'var(--color-teal)' : '#fff' }}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
