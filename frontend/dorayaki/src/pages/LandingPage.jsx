import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  // Mock Data for "Royal Signatures" showcase
  const signatureSweets = [
    {
      _id: '1',
      name: 'Crossiant',
      price: 110,
      category: 'Fusion',
      imageUrl: '/croissant.png',
      quantity: 5
    },
    {
      _id: '2',
      name: 'Golden Peda',
      price: 90.00,
      category: 'Signature',
      imageUrl: '/coconut-ladoo.jpg',
      quantity: 20
    },
    {
      _id: '3',
      name: 'Coconut Ladoo',
      price: 80.00,
      category: 'Mithai',
      imageUrl: '/golden-peda.jpg',
      quantity: 20
    }
  ];

  return (
    <div>
      <Hero />
      
      <section style={{ padding: '6rem 0' }}>
        <div className="container">
          <h2 className="section-title">Our Signatures</h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {signatureSweets.map(sweet => (
              <ProductCard key={sweet._id} product={sweet} onAddToCart={() => window.location.href = '/sweets'} />
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <Link to="/sweets" className="btn btn-secondary">
              View Full Menu
            </Link>
          </div>
        </div>
      </section>

      <section style={{ 
        backgroundColor: '#fff', 
        padding: '6rem 0',
        display: 'flex',
        alignItems: 'center'
      }}>
         <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }}>
            <div>
              <img 
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80" 
                alt="Chef making sweets" 
                style={{ width: '100%', borderRadius: '12px', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              />
            </div>
            <div>
              <h2 className="section-title" style={{ left: 0, transform: 'none', textAlign: 'left', display: 'block', margin: '0 0 2rem 0' }}>
                 A Legacy of Flavor
              </h2>
              <p style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>
                Our master Halwais carry the secrets of royal kitchens, creating magic with recipes passed down through generations. We blend this timeless heritage with a modern touch.
              </p>
              <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
                From the rich aroma of pure Desi Ghee to the delicate crunch of dry fruits, every sweet is a tribute to our roots. It is the authentic taste of India ("Apna Swad"), crafted for the world.
              </p>
              <Link to="/about" style={{ color: 'var(--color-saffron)', borderBottom: '2px solid var(--color-saffron)', paddingBottom: '5px' }}>
                Read Our Story
              </Link>
            </div>
         </div>
      </section>
    </div>
  );
};

export default LandingPage;
