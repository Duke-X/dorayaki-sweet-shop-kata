import { useEffect, useState } from 'react';
import api from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [sweets, setSweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchSweets = async () => {
    try {
      const response = await api.get('/sweets');
      setSweets(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch sweets", err);
      // alert("Error fetching data");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSweets();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this sweet?")) return;
    try {
      await api.delete(`/sweets/${id}`);
      fetchSweets();
    } catch (err) {
      alert("Failed to delete sweet");
    }
  };

  const handleRestock = async (id) => {
    const qty = prompt("Enter quantity to add:", "10");
    if (!qty) return;
    try {
      await api.post(`/sweets/${id}/restock`, { quantity: parseInt(qty) });
      fetchSweets();
    } catch (err) {
      alert("Failed to restock");
    }
  };

  if (loading) return <div style={{ paddingTop: '100px', textAlign: 'center' }}>Loading Dashboard...</div>;

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', paddingBottom: '4rem' }}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--color-teal)' }}>Admin Dashboard</h2>
          <Link to="/admin/new" className="btn btn-primary">Add New Sweet</Link>
        </div>

        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
            <thead>
              <tr style={{ background: 'var(--color-teal)', color: '#fff' }}>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Stock</th>
                <th style={{ padding: '1rem', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '1rem', textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sweets.map(sweet => (
                <tr key={sweet._id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '1rem' }}>
                    <img src={sweet.imageUrl} alt={sweet.name} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '4px' }} />
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 'bold' }}>{sweet.name}</td>
                  <td style={{ padding: '1rem' }}>₹{sweet.price}</td>
                  <td style={{ padding: '1rem', color: sweet.quantity < 5 ? 'red' : 'green' }}>{sweet.quantity}</td>
                  <td style={{ padding: '1rem' }}>{sweet.category}</td>
                  <td style={{ padding: '1rem', display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button onClick={() => handleRestock(sweet._id)} className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: '#2ecc71', color: '#fff' }}>Restock</button>
                    <Link to={`/admin/edit/${sweet._id}`} className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: 'var(--color-gold)', color: '#fff', textDecoration: 'none', display: 'inline-block' }}>Edit</Link>
                    <button onClick={() => handleDelete(sweet._id)} className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem', background: '#e74c3c', color: '#fff' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
