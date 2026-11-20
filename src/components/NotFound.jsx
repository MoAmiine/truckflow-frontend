import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <h2 style={{ fontSize: '3rem', margin: 0, color: '#dc2626' }}>404</h2>
      <h3 style={{ marginTop: '10px', color: '#1e293b' }}>Page Introuvable</h3>
      <p style={{ color: '#64748b', margin: '12px 0 24px' }}>
        L'URL que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <Link to="/" style={{ textDecoration: 'none', background: '#2563eb', color: '#fff', padding: '10px 20px', borderRadius: '6px', fontWeight: 500 }}>
        Retour à l'accueil
      </Link>
    </div>
  );
}
