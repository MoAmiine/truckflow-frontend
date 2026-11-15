import './App.css';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import { apiRequest } from './services/api';
import ProtectedView from './components/ProtectedView';
import DriverLayout from './components/DriverLayout';

function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (result) => {
    setSession(result.data);
  };

  const handleLogout = async () => {
    try {
      if (session?.accessToken) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          token: session.accessToken
        });
      }
    } catch (err) {
      console.error('Erreur lors du logout:', err.message);
    } finally {
      setSession(null);
    }
  };

  return (
    <div className="app-container">
      <h1>FleetTrackPRO — Gestion de Flotte</h1>

      {!session ? (
        <LoginForm onlogin={handleLogin} />
      ) : (
        <div className="main-layout">
          <header className="app-header">
            <div>
              Connecté: <strong>{session.prenom} {session.nom}</strong>
              <span className="badge-role"> ({session.role})</span>
            </div>
            <button onClick={handleLogout}>Se déconnecter</button>
          </header>

          <ProtectedView session={session} allowedRoles={['admin']}>
            <section className="admin-view">
              <h3>🛠️ Espace Administration Flotte</h3>
              <p>Bienvenue Admin. Vous avez le contrôle total sur la flotte.</p>
            </section>
          </ProtectedView>

          <ProtectedView session={session} allowedRoles={['chauffeur']}>
            <section className="driver-view">
              <h3>🚚 Espace Chauffeur</h3>
              <DriverLayout session={session}/>
            </section>
          </ProtectedView>
        </div>
      )}
    </div>
  );
}

export default App;
