import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Forbidden() {
  const { session } = useAuth();
  const homePath = session?.role === 'admin' ? '/admin/camions' : session?.role === 'chauffeur' ? '/chauffeur/trajets' : '/login';

  return (
    <div className="access-denied" style={{ maxWidth: '500px', margin: '40px auto', padding: '30px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '2.5rem', margin: 0, color: '#991b1b' }}>403</h2>
      <h3 style={{ marginTop: '10px' }}>Accès Refusé</h3>
      <p style={{ margin: '14px 0 24px' }}>
        Votre rôle actuel ({session?.role || 'Non authentifié'}) n'a pas les autorisations nécessaires pour accéder à cette ressource.
      </p>
      <Link to={homePath} style={{ textDecoration: 'none', background: '#991b1b', color: '#fff', padding: '10px 18px', borderRadius: '6px', fontWeight: 500 }}>
        Retour à votre espace
      </Link>
    </div>
  );
}
