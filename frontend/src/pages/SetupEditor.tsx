import React, { useState } from 'react';
import api from '../services/api';
import ComponentSearch from '../components/ComponentSearch';

interface SetupEditorProps {
  token: string;
  onSetupCreated: () => void;
}

const SetupEditor: React.FC<SetupEditorProps> = ({ token, onSetupCreated }) => {
  const [setupName, setSetupName] = useState('');
  const [description, setDescription] = useState('');
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleCreateSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const setupResponse = await api.post('/setups', { name: setupName, description }, { headers: { Authorization: `Bearer ${token}` } });
      const setupId = setupResponse.data.id;
      for (const component of components) {
        await api.post('/components', { setup_id: setupId, name: component.name, category: component.category, product_url: component.product_url }, { headers: { Authorization: `Bearer ${token}` } });
      }
      setSuccess('Setup erfolgreich erstellt!');
      setSetupName('');
      setDescription('');
      setComponents([]);
      setTimeout(() => { onSetupCreated(); }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Fehler beim Erstellen des Setups');
    } finally {
      setLoading(false);
    }
  };

  const addComponent = (component: any) => {
    setComponents([...components, { ...component, id: Date.now() }]);
  };

  const removeComponent = (id: number) => {
    setComponents(components.filter((c) => c.id !== id));
  };

  return (
    <div>
      <h2>Neues PC-Setup erstellen</h2>
      {error && <div className="error">{error}</div>}
      {success && <div className="success">{success}</div>}
      <div className="card">
        <form onSubmit={handleCreateSetup}>
          <div className="input-group">
            <label>Setup-Name</label>
            <input type="text" value={setupName} onChange={(e) => setSetupName(e.target.value)} placeholder="z.B. Gaming PC 2024" required />
          </div>
          <div className="input-group">
            <label>Beschreibung (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Beschreibe deinen PC..." rows={3} />
          </div>
          <h3>Komponenten</h3>
          <ComponentSearch onComponentSelected={addComponent} token={token} />
          <div style={{ marginTop: '20px' }}>
            {components.length === 0 ? (
              <p>Noch keine Komponenten hinzugefügt.</p>
            ) : (
              <>
                <h4>Komponenten ({components.length}):</h4>
                {components.map((comp) => (
                  <div key={comp.id} className="component-item">
                    <div className="flex">
                      <div>
                        <strong>{comp.name}</strong>
                        <div className="category">{comp.category}</div>
                      </div>
                      <button type="button" onClick={() => removeComponent(comp.id)} className="btn btn-danger">Entfernen</button>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
          <button type="submit" className="btn" disabled={loading || setupName === '' || components.length === 0} style={{ marginTop: '20px' }}>
            {loading ? 'Erstellt...' : 'Setup erstellen'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SetupEditor;
