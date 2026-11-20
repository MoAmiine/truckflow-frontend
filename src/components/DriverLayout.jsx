import { NavLink, Outlet } from 'react-router-dom';

export default function DriverLayout({ session, onLogout }) {
  return (
    <div className="driver-layout-container">
      <header className="app-header">
        <div className="user-session-info">
          <span>Connecté : <strong>{session?.prenom} {session?.nom}</strong></span>
          <span className={`badge-role ${session?.role}`}>{session?.role}</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>Se déconnecter</button>
      </header>

      <nav className="driver-nav" style={{ display: 'flex', gap: '10px', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <NavLink to="/chauffeur/trajets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Mes Trajets
        </NavLink>
      </nav>

      <main className="driver-main-content">
        <Outlet />
      </main>
    </div>
  );
}
