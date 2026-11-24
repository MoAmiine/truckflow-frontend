import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function TrajetList({ session }) {
    const [trajets, setTrajets] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [statusFilter, setStatusFilter] = useState('Tous')

    useEffect(() => {
        const controller = new AbortController();
        const fetchTrajets = async () => {
            try {
                const result = await apiRequest('/trajets', { token: session?.accessToken, signal: controller.signal })
                setTrajets(result.data)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchTrajets()
        return () => controller.abort();
    }, [session?.accessToken]);

    const filteredTrajets = trajets.filter((t) => {
        if (statusFilter === 'Tous') return true
        return t.statut === statusFilter
    })

    return (
        <div className="trajet-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3>Planification des Trajets ({filteredTrajets.length})</h3>
                <Link
                    to="/admin/trajets/nouveau"
                    className="btn-primary"
                    style={{ textDecoration: 'none', width: 'auto', display: 'inline-block' }}
                >
                    Planifier un Trajet
                </Link>
            </div>

            {error && <p className="error-text">{error}</p>}

            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
                <div>
                    <label style={{ marginRight: '6px', fontSize: '0.9em', fontWeight: 600 }}>Statut :</label>
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="Tous">Tous les statuts</option>
                        <option value="en_attente">En attente</option>
                        <option value="en_cours">En cours</option>
                        <option value="termine">Terminé</option>
                        <option value="annule">Annulé</option>
                    </select>
                </div>
            </div>

            {isLoading && <p>Chargement des trajets en cours...</p>}

            {!isLoading && filteredTrajets.length === 0 && (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>
                    Aucun trajet trouvé.
                </p>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {filteredTrajets.map((trajet) => (
                    <div key={trajet._id || trajet.id} className="truck-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>
                                {trajet.siteDepart} - {trajet.siteArrivee}
                            </h4>
                            <span className={`status-badge ${trajet.statut}`}>
                                {trajet.statut}
                            </span>
                        </div>

                        <div style={{ margin: '10px 0', fontSize: '0.9rem', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                            <p><strong>Marchandise :</strong> {trajet.marchandise || 'Standard'}</p>
                            <p><strong>Départ prévu :</strong> {trajet.dateDepartPrevue ? new Date(trajet.dateDepartPrevue).toLocaleDateString() : 'Non définie'}</p>
                            <p><strong>Chauffeur :</strong> {trajet.chauffeurId ? `${trajet.chauffeurId.prenom} ${trajet.chauffeurId.nom}` : 'Non assigné'}</p>
                            <p><strong>Camion :</strong> {trajet.camionId?.immatriculation || 'Non assigné'}</p>
                            <p><strong>Remorque :</strong> {trajet.remorqueId?.immatriculation || 'Non assignée'}</p>
                        </div>

                        <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                            <Link
                                to={`/admin/trajets/${trajet._id || trajet.id}`}
                                style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}
                            >
                                Détails de la mission -{'>'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}