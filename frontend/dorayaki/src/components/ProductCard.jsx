import { useState } from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, onAddToCart }) => {
  const { _id, name, price, imageUrl, quantity: stockQuantity, category } = product;
  const isOutOfStock = stockQuantity <= 0;
  
  const [selectedQty, setSelectedQty] = useState(1);

  const handleQtyChange = (e) => {
      const val = parseInt(e.target.value);
      if (val > 0) setSelectedQty(val);
  };

  const subtotal = (price * selectedQty).toFixed(2);

  return (
    <div style={{
      background: '#fff',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      maxWidth: '320px', 
      margin: '0 auto'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-5px)';
      e.currentTarget.style.boxShadow = '0 20px 40px -10px rgba(0,0,0,0.2)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.1)';
    }}
    >
      <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
        <img 
          src={imageUrl || 'https://images.unsplash.com/photo-1542385151-ef290087a3a4?auto=format&fit=crop&w=500&q=60'} 
          alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
        />
        {isOutOfStock && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(255,255,255,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#c62828',
            fontSize: '1.2rem',
            letterSpacing: '1px'
          }}>
            OUT OF STOCK
          </div>
        )}
      </div>

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
             <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--color-gold)', letterSpacing: '1px', fontWeight: 'bold' }}>
               {category || 'Mithai'}
             </span>
             {!isOutOfStock && <span style={{ fontSize: '0.8rem', color: '#888' }}>In Stock</span>}
        </div>
        
        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontFamily: 'var(--font-heading)', lineHeight: '1.2' }}>{name}</h3>
        
        <p style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--color-teal)', marginBottom: '1rem' }}>
          ₹{typeof price === 'number' ? price.toFixed(2) : price} <span style={{fontSize: '0.8rem', fontWeight: 'normal'}}>/ unit</span>
        </p>

        {/* Quantity and Subtotal Section */}
        <div style={{ marginTop: 'auto' }}>
            {!isOutOfStock && (
                <div style={{ marginBottom: '1rem', background: '#f9f9f9', padding: '0.8rem', borderRadius: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <label style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>Qty:</label>
                        <input 
                            type="number" 
                            min="1" 
                            value={selectedQty} 
                            onChange={handleQtyChange}
                            style={{ width: '60px', padding: '4px', borderRadius: '4px', border: '1px solid #ccc' }}
                        />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', color: '#555' }}>
                        <span>Subtotal:</span>
                        <span style={{ fontWeight: 'bold', color: 'var(--color-teal)' }}>₹{subtotal}</span>
                    </div>
                </div>
            )}

            <button 
              onClick={() => onAddToCart && onAddToCart(product, selectedQty)}
              disabled={isOutOfStock}
              className="btn"
              style={{ 
                width: '100%',
                backgroundColor: isOutOfStock ? '#ccc' : 'var(--color-teal)',
                color: '#fff',
                cursor: isOutOfStock ? 'not-allowed' : 'pointer',
                opacity: isOutOfStock ? 0.7 : 1
              }}
            >
              {isOutOfStock ? 'Sold Out' : 'Add to Bag'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
