import React, { useState } from 'react';
import api from '../services/api';

interface LoginProps {
  onLogin: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const response = await api.post(endpoint, { email, password });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.token);
      } else {
        setError('Erfolgreich registriert! Bitte logge dich ein.');
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h2>{isLogin ? 'Login' : 'Registrierung'}</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="input-group">
          <label>Passwort</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn" disabled={loading}>
          {loading ? 'Lädt...' : isLogin ? 'Login' : 'Registrieren'}
        </button>
      </form>
      <p style={{ marginTop: '15px', textAlign: 'center' }}>
        {isLogin ? 'Noch kein Konto?' : 'Bereits registriert?'}{' '}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(''); }} style={{ background: 'none', border: 'none', color: '#3498db', cursor: 'pointer' }}>
          {isLogin ? 'Hier registrieren' : 'Hier einloggen'}
        </button>
      </p>
    </div>
  );
};

export default Login;
