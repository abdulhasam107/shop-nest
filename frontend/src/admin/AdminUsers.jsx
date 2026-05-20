import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const AdminUsers = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !user.token) {
      setUsers([]);
      return;
    }

    let cancelled = false;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/auth/users', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to fetch users');
        }
        const data = await res.json();
        if (!cancelled) setUsers(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Error fetching users:', err);
        if (!cancelled) {
          setError(err.message || 'Failed to load users');
          setUsers([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchUsers();
    return () => {
      cancelled = true;
    };
  }, [user]);

  if (!user) {
    return (
      <div style={containerStyle}>
        <h2 style={{ color: '#f97316' }}>Please log in to view users</h2>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ color: '#f97316', marginBottom: '20px' }}>User Directory</h2>
      {loading && <p>Loading users...</p>}
      {error && <p style={{ color: 'salmon' }}>{error}</p>}
      <div style={{ overflowX: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr style={rowStyle}>
              <th style={thStyle}>ID</th>
              <th style={thStyle}>NAME</th>
              <th style={thStyle}>EMAIL</th>
              <th style={thStyle}>ROLE</th>
              <th style={thStyle}>JOINED</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 && !loading ? (
              <tr style={rowStyle}>
                <td style={tdStyle} colSpan={5}>
                  No users found.
                </td>
              </tr>
            ) : (
              users.map(u => (
                <tr key={u._id || u.id || Math.random()} style={rowStyle}>
                  <td style={tdStyle}>{(u._id || u.id || '—').toString().substring(0, 8)}...</td>
                  <td style={tdStyle}>{u.name || '—'}</td>
                  <td style={tdStyle}>{u.email || '—'}</td>
                  <td style={tdStyle}>
                    <span style={{ background: (u.role === 'admin') ? 'rgba(234,88,12,0.2)' : 'rgba(16,185,129,0.2)', color: (u.role === 'admin') ? '#f97316' : '#10b981', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      {(u.role || 'user').toString().toUpperCase()}
                    </span>
                  </td>
                  <td style={tdStyle}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const containerStyle = { maxWidth: '1200px', margin: '40px auto', padding: '30px', background: '#18181b', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', color: '#fafafa' };
const tableStyle = { width: '100%', borderCollapse: 'collapse' };
const rowStyle = { borderBottom: '1px solid rgba(255,255,255,0.1)' };
const thStyle = { padding: '15px', textAlign: 'left', color: '#a1a1aa', fontSize: '0.9rem' };
const tdStyle = { padding: '15px', textAlign: 'left' };

export default AdminUsers;
