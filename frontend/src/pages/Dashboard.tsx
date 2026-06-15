import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SetupCard from '../components/SetupCard';

interface Setup {
  id: number;
  name: string;
  description?: string;
  created_at: string;
}

interface DashboardProps {
  token: string;
}

const Dashboard: React.FC<DashboardProps> = ({ token }) => {
  const [setups, setSetups] = useState<Setup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSetups();
  }, []);

  const fetchSetups = async () => {
    try {
      setLoading(true);
      const response = await api.get('/setups', { headers: { Authorization: `Bearer ${token}` } });
      setSetups(response.data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Laden der Setups');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Lädt...</div>;

  return (
    <div>
      <h2>Meine PC-Setups</h2>
      {error && <div className="error">{error}</div>}
      {setups.length === 0 ? (
        <div className="card"><p>Noch keine Setups erstellt. Erstelle jetzt dein erstes Setup!</p></div>
      ) : (
        <div className="grid">
          {setups.map((setup) => (
            <SetupCard key={setup.id} setup={setup} token={token} onDelete={fetchSetups} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
