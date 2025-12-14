import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div style={{
      position: 'relative',
      height: '90vh', // Full viewport minus header
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '-80px', // Pull up behind navbar
      paddingTop: '80px',
      overflow: 'hidden',
      color: '#fff',
      textAlign: 'center',
      background: 'linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.4)), url("/hero-bg-2.jpg") center/cover no-repeat'
    }}>
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <h1 style={{ 
          fontSize: '5rem', 
          marginBottom: '1rem', 
          color: '#fff',
          textShadow: '0 2px 10px rgba(0,0,0,0.3)'
        }}>
          Royal Art of Mithai
        </h1>
        <p style={{ 
          fontSize: '1.5rem', 
          maxWidth: '600px', 
          margin: '0 auto 2rem',
          fontFamily: 'var(--font-heading)',
          fontStyle: 'italic',
          color: '#f0f0f0'
        }}>
          Where Tradition Meets Luxury. Handcrafted sweets for the discerning palate.
        </p>
        <Link to="/sweets" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 3rem' }}>
          Explore Collection
        </Link>
      </div>

      {/* Decorative overlaid gradient for depth */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '150px',
        background: 'linear-gradient(to top, var(--color-cream), transparent)'
      }}></div>
    </div>
  );
};

export default Hero;
