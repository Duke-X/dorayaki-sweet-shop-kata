import { useEffect, useState } from 'react';
import api from '../api/axios';
import ProductCard from '../components/ProductCard';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const ShopPage = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [searchName, setSearchName] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchSweets = async () => {
    try {
      setLoading(true);
      setError('');
      
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append('name', searchName);
      if (category) queryParams.append('category', category);
      if (minPrice) queryParams.append('minPrice', minPrice);
      if (maxPrice) queryParams.append('maxPrice', maxPrice);
      
      const endpoint = queryParams.toString() ? `/sweets/search?${queryParams.toString()}` : '/sweets';
      
      console.log("Fetching:", endpoint); // Debug
      const response = await api.get(endpoint);
      setSweets(response.data);
    } catch (err) {
      console.error("Failed to fetch sweets", err);
       // Allow 404 if search yields no results (handled by empty array usually, but just in case)
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          navigate('/login');
      } else {
        setError('Unable to load our collection. Please try again later.');
      }
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
        fetchSweets();
    }, 500); 
    return () => clearTimeout(timer);
  }, [searchName, category, minPrice, maxPrice, navigate]);

  const handleAddToCart = (product, quantity) => {
    addToCart(product, quantity);
    alert(`${quantity} x ${product.name} added to bag!`);
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        <h2 className="section-title">The Royal Collection</h2>
        
        {/* Search & Filter UI */}
        <div style={{ 
            background: '#fff', 
            padding: '1.5rem', 
            borderRadius: '12px', 
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '1rem',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <input 
                type="text" 
                placeholder="Search Sweets..." 
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', flex: '1 1 200px' }}
            />
            
            <select 
                value={category} 
                onChange={e => setCategory(e.target.value)}
                style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', flex: '1 1 150px' }}
            >
                <option value="">All Categories</option>
                <option value="Mithai">Mithai</option>
                <option value="Pastry">Pastry</option>
                <option value="Fusion">Fusion</option>
                <option value="Truffles">Truffles</option>
                <option value="Signature">Signature</option>
            </select>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <input 
                    type="number" 
                    placeholder="Min ₹" 
                    value={minPrice}
                    onChange={e => setMinPrice(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', width: '80px' }}
                />
                <span>-</span>
                 <input 
                    type="number" 
                    placeholder="Max ₹" 
                    value={maxPrice}
                    onChange={e => setMaxPrice(e.target.value)}
                    style={{ padding: '0.8rem', borderRadius: '4px', border: '1px solid #ddd', width: '80px' }}
                />
            </div>
        </div>

        {error && <div style={{ textAlign: 'center', color: 'red', marginBottom: '1rem' }}>{error}</div>}
        
        {loading ? (
             <div style={{ textAlign: 'center', padding: '2rem' }}>Updating Collection...</div>
        ) : (
            <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', 
                gap: '1.5rem',
                justifyContent: 'center'
            }}>
            {sweets.map(sweet => (
                <ProductCard 
                key={sweet._id} 
                product={sweet} 
                onAddToCart={handleAddToCart}
                />
            ))}
            </div>
        )}
        
        {!loading && sweets.length === 0 && !error && (
            <div style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.6 }}>
                <p style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>No sweets found matching your search.</p>
                <button onClick={() => { setSearchName(''); setCategory(''); setMinPrice(''); setMaxPrice(''); }} className="btn btn-secondary">
                    Clear Filters
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default ShopPage;
