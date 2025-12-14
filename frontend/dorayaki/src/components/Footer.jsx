import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--color-teal)',
      color: '#fff',
      padding: '4rem 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        <div>
          <h3 style={{ color: 'var(--color-gold)', marginBottom: '1.5rem' }}>DORAYAKI</h3>
          <p style={{ opacity: 0.8, lineHeight: 1.8 }}>
            Handcrafted with passion, blending royal traditions with modern elegance.
            Experience the finest mithai made from premium ingredients.
          </p>
        </div>
        
        <div>
          <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>Quick Links</h4>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '0.8rem' }}><Link to="/sweets" style={{opacity: 0.8}}>Our Collection</Link></li>
            <li style={{ marginBottom: '0.8rem' }}><Link to="/about" style={{opacity: 0.8}}>Our Journey</Link></li>
            <li style={{ marginBottom: '0.8rem' }}><Link to="/contact" style={{opacity: 0.8}}>Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-body)' }}>Contact Us</h4>
          <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>Sector-32 A, Jamalpur, Ludhiana</p>
          <p style={{ opacity: 0.8, marginBottom: '0.5rem' }}>helpdesk@dorayaki.com</p>
          <p style={{ opacity: 0.8 }}>+91 98765 43210</p>
        </div>
      </div>
      
      <div style={{ textAlign: 'center', marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.6 }}>&copy; {new Date().getFullYear()} Dorayaki Sweet Shop. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
