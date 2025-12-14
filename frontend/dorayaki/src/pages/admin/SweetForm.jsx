import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const SweetForm = () => {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [image, setImage] = useState(null);
  // For edit mode, existing image URL
  const [currentImageUrl, setCurrentImageUrl] = useState('');

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get('/sweets').then(res => {
          const sweet = res.data.find(s => s._id === id);
          if (sweet) {
             setName(sweet.name);
             setCategory(sweet.category);
             setPrice(sweet.price);
             setQuantity(sweet.quantity);
             setCurrentImageUrl(sweet.imageUrl);
          }
      });
    }
  }, [id, isEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isEdit) {
        // Edit mode: Send JSON (no image update support in this simplified version for now)
        await api.put(`/sweets/${id}`, { name, category, price, quantity });
      } else {
        // Create mode: Send FormData
        const formData = new FormData();
        formData.append('name', name);
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quantity', quantity);
        if (image) {
           formData.append('image', image);
        }

        await api.post('/sweets', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      navigate('/admin');
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || "Operation failed. Check if Cloudinary is configured.";
      alert(`Error: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container" style={{ maxWidth: '600px' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '2rem', color: 'var(--color-teal)' }}>
          {isEdit ? 'Edit Sweet' : 'Add New Sweet'}
        </h2>

        <div style={{ background: '#fff', padding: '2rem', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sweet Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} required style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>
            
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Category</label>
              <input type="text" value={category} onChange={e => setCategory(e.target.value)} required placeholder="e.g. Mithai, Truffle" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price (₹)</label>
                <input type="number" value={price} onChange={e => setPrice(e.target.value)} required min="0" step="0.01" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Quantity (kg/pieces)</label>
                <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} required min="0" style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} />
              </div>
            </div>

            {!isEdit ? (
                <div>
                   <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Sweet Image</label>
                   <input 
                     type="file" 
                     accept="image/*"
                     onChange={e => setImage(e.target.files[0])} 
                     required 
                     style={{ width: '100%', padding: '0.8rem', borderRadius: '4px', border: '1px solid #ccc' }} 
                   />
                </div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontSize: '0.9rem', color: '#666' }}>Current Image:</p>
                    <img src={currentImageUrl} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }} />
                    <p style={{ fontSize: '0.8rem', color: '#888' }}>Image update not supported in Edit mode yet.</p>
                </div>
            )}

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>
                {loading ? 'Saving...' : (isEdit ? 'Update Sweet' : 'Create Sweet')}
              </button>
              <button type="button" onClick={() => navigate('/admin')} className="btn" style={{ background: '#eee', color: '#333' }}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SweetForm;
