import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const CartPage = () => {
  const { cart, removeFromCart, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
        navigate('/login');
        return;
    }
    
    if (cart.length === 0) return;

    setLoading(true);
    try {
        // Backend API is one-by-one purchase. We will loop.
        // ideally backend should have /orders endpoint.
        for (const item of cart) {
            await api.post(`/sweets/${item._id}/purchase`, { quantity: item.quantity });
        }
        alert("Order placed successfully!");
        clearCart();
        navigate('/sweets');
    } catch (err) {
        console.error(err);
        alert("Some items could not be purchased. Please check stock.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '80vh' }} className="container">
       <h2 className="section-title">Your Bag</h2>

       {cart.length === 0 ? (
           <div style={{ textAlign: 'center', opacity: 0.7 }}>
               <p>Your bag is empty.</p>
               <button onClick={() => navigate('/sweets')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Continue Shopping</button>
           </div>
       ) : (
           <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
              <div>
                  {cart.map(item => (
                      <div key={item._id} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', background: '#fff', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <img src={item.imageUrl} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div style={{ flex: 1 }}>
                              <h4 style={{ margin: 0 }}>{item.name}</h4>
                              <p style={{ color: 'var(--color-gold)', margin: '0.2rem 0' }}>₹{item.price}</p>
                              <p style={{ fontSize: '0.9rem' }}>Qty: {item.quantity}</p>
                          </div>
                          <button onClick={() => removeFromCart(item._id)} style={{ color: 'red', fontWeight: 'bold' }}>Remove</button>
                      </div>
                  ))}
              </div>
              
              <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', height: 'fit-content', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
                  <h3>Summary</h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0' }}>
                      <span>Subtotal</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', margin: '1rem 0', fontSize: '1.2rem', fontWeight: 'bold' }}>
                      <span>Total</span>
                      <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <button onClick={handleCheckout} disabled={loading} className="btn btn-primary" style={{ width: '100%' }}>
                      {loading ? 'Processing...' : 'Checkout'}
                  </button>
              </div>
           </div>
       )}
    </div>
  );
};
export default CartPage;
