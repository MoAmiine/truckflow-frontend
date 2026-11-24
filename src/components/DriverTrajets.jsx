import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { Link } from "react-router-dom";

function DriverTrajets({ session }) {
  const [trajet, setTrajet] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMyTrajets = async () => {
      try {
        const result = await apiRequest('/trajets/mes-trajets', { token: session?.accessToken });
        setTrajet(result.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMyTrajets();
  }, [session?.accessToken]);

  return (
    <div className="driver-layout">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>Espace Chauffeur - Mes Missions</h3>
      </div>

      {isLoading && <p>Chargement de vos missions...</p>}

      {error && <p className="error-text">{error}</p>}

      {!isLoading && !error && trajet.length === 0 && (
        <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>
          Aucun trajet ne vous a ete assigne pour le moment.
        </p>
      )}

      {!isLoading && trajet.length > 0 && (
        <ul className="trajet-list" style={{ listStyle: 'none', padding: 0 }}>
          {trajet.map((t) => (
            <li key={t._id} className="trajet-card" style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4 style={{ fontSize: '1.1rem', margin: 0 }}>
                  {t.siteDepart || t.lieuDepart} - {t.siteArrivee || t.destination}
                </h4>
                <span className={`status-badge ${t.statut}`}>{t.statut}</span>
              </div>

              <div style={{ margin: '8px 0', color: '#475569', fontSize: '0.9rem' }}>
                <p style={{ margin: '4px 0' }}>
                  <strong>Camion :</strong> {t.camionId?.immatriculation || 'Non assigne'} {t.camionId?.marque ? `(${t.camionId.marque})` : ''}
                </p>
                <p style={{ margin: '4px 0' }}>
                  <strong>Date depart :</strong> {t.dateDepartPrevue ? new Date(t.dateDepartPrevue).toLocaleDateString() : 'Non definie'}
                </p>
              </div>

              <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                <Link
                  to={`/chauffeur/trajets/${t._id}`}
                  style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}
                >
                  Details de la mission -{'>'}
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DriverTrajets;
