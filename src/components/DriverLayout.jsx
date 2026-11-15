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
            <header>Bienvenue {session.prenom} {session.nom}</header>
            <button onClick={handleLoadTrajet} disabled={isLoading}>
                {isLoading ? 'Chargement...' : 'Consulter mes trajets'}
            </button>
            {error && <p className="error">{error}</p>}
            {hasLoaded && !isLoading && trajet.length === 0 && (
                <p>Aucun trajet ne vous a été assigné</p>
            )}
            {trajet.length > 0 && (
                <ul className="trajet-list">
                    {trajet.map((t) => (
                        <li key={t._id} className="trajet-card">
                            <h4>{t.lieuDepart} ➔ {t.destination}</h4>
                            <p>Statut : {t.statut}</p>
                            <p>Camion : {t.camionId?.immatriculation || 'Non assigné'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default DriverLayout;