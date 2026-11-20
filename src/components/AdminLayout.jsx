import { NavLink, Outlet } from 'react-router-dom';

export default function AdminLayout({ session, onLogout }) {
  return (
    <div className="admin-layout-container">
      <header className="app-header">
        <div className="user-session-info">
          <span>Connecté : <strong>{session?.prenom} {session?.nom}</strong></span>
          <span className={`badge-role ${session?.role}`}>{session?.role}</span>
        </div>
        <button className="btn-logout" onClick={onLogout}>Se déconnecter</button>
      </header>

      <nav className="admin-nav" style={{ display: 'flex', gap: '10px', background: '#fff', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
        <NavLink to="/admin/camions" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Camions
        </NavLink>
        <NavLink to="/admin/utilisateurs" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Utilisateurs
        </NavLink>
        <NavLink to="/admin/remorques" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Remorques
        </NavLink>
        <NavLink to="/admin/trajets" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Trajets
        </NavLink>
      </nav>

      <main className="admin-main-content">
        <Outlet />
      </main>
    </div>
  );
}
