import React, { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SetupEditor from './pages/SetupEditor';

type Page = 'login' | 'dashboard' | 'editor';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      setCurrentPage('dashboard');
    }
  }, [token]);

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token');
    setCurrentPage('login');
  };

  return (
    <div className="App">
      <header>
        <div className="container">
          <h1>💻 PC Price Tracker</h1>
          {token && <button onClick={handleLogout} className="btn btn-logout">Logout</button>}
        </div>
      </header>
      <main className="container">
        {!token ? (
          <Login onLogin={(t) => { setToken(t); setCurrentPage('dashboard'); }} />
        ) : (
          <>
            <div className="nav">
              <button onClick={() => setCurrentPage('dashboard')} className={currentPage === 'dashboard' ? 'active' : ''}>Dashboard</button>
              <button onClick={() => setCurrentPage('editor')} className={currentPage === 'editor' ? 'active' : ''}>Neues Setup</button>
            </div>
            {currentPage === 'dashboard' && <Dashboard token={token} />}
            {currentPage === 'editor' && <SetupEditor token={token} onSetupCreated={() => setCurrentPage('dashboard')} />}
          </>
        )}
      </main>
    </div>
  );
};

export default App;
