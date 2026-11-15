import './App.css';
import { useState } from 'react';
import LoginForm from './components/LoginForm';
import { apiRequest } from './services/api';
import ProtectedView from './components/ProtectedView';
import DriverLayout from './components/DriverLayout';
import UserList from './components/UserList';


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
      <h1 className="app-title">🚛 FleetTrackPRO — Gestion de Flotte</h1>

      {!session ? (
        <LoginForm onlogin={handleLogin} />
      ) : (
        <div className="main-layout">
          <header className="app-header">
            <div className="user-session-info">
              <span>Connecté : <strong>{session.prenom} {session.nom}</strong></span>
              <span className={`badge-role ${session.role}`}>{session.role}</span>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Se déconnecter</button>
          </header>

          <ProtectedView session={session} allowedRoles={['admin']}>
            <section className="admin-view">
              <h3>🛠️ Espace Administration Flotte</h3>
              <p>Bienvenue Admin. Vous avez le contrôle total sur la flotte.</p>
              <UserList session={session} />
            </section>
          </ProtectedView>

          <ProtectedView session={session} allowedRoles={['chauffeur']}>
            <section className="driver-view">
              <h3>Espace Chauffeur</h3>
              <DriverLayout session={session}/>
            </section>
          </ProtectedView>
        </div>
      )}
    </div>
  );
}

export default App;
