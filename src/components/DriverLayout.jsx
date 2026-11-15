import { useState } from "react";
import { apiRequest } from "../services/api";


function DriverLayout({ session }) {
    const [trajet, setTrajet] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null)
    const [hasLoaded, setHasLoaded] = useState(false)

    const handleLoadTrajet = async () => {
        setIsLoading(true)
        setError(null)
        try {
            const result = await apiRequest('/trajets/mes-trajets', { token: session.accessToken });
            setTrajet(result.data)
            setHasLoaded(true)
        } catch (error) {
            setError(error.message)
        } finally {
            setIsLoading(false);
        }
    }

    return (

        <div className="driver-layout">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3>🚚 Espace Chauffeur — Mes Missions</h3>
                <button className="btn-primary" style={{ width: 'auto' }} onClick={handleLoadTrajet} disabled={isLoading}>
                    {isLoading ? 'Chargement...' : 'Consulter mes trajets'}
                </button>
            </div>
            {error && <p className="error-text">{error}</p>}
            {hasLoaded && !isLoading && trajet.length === 0 && (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>Aucun trajet ne vous a été assigné pour le moment.</p>
            )}
            {trajet.length > 0 && (
                <ul className="trajet-list">
                    {trajet.map((t) => (
                        <li key={t._id} className="trajet-card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4 style={{ fontSize: '1.1rem' }}>{t.lieuDepart} ➔ {t.destination}</h4>
                                <span className={`status-badge ${t.statut}`}>{t.statut}</span>
                            </div>
                            <p style={{ margin: '6px 0', color: '#475569' }}>
                                <strong>Camion :</strong> {t.camionId?.immatriculation || 'Non assigné'} {t.camionId?.marque ? `(${t.camionId.marque})` : ''}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                                <strong>Date départ :</strong> {t.dateDepartPrevue ? new Date(t.dateDepartPrevue).toLocaleDateString() : 'Non définie'}
                            </p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DriverLayout;