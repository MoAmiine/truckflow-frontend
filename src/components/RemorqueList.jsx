import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../services/api';


export default function RemorqueList({ session }) {
    const [remorques, setRemorques] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [typeFilter, setTypeFilter] = useState('Tous');

    useEffect(() => {
        const controller = new AbortController();
        const fetchRemorques = async () => {
            try {
                const result = await apiRequest('/remorques', { token: session?.accessToken, signal: controller.signal }); setRemorques(result.data)
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message)
                }
            } finally {
                setIsLoading(false)
            }
        }
        fetchRemorques()
        return () => controller.abort()
    }, [session?.accessToken])

    const filteredRemorques = remorques.filter((r) => {
        if (typeFilter === 'Tous') return true
        return r.type === typeFilter
    })


    return (
        <div className="remorque-management">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
                <h3>Gestion du Parc Remorques ({filteredRemorques.length})</h3>
                <Link
                    to="/admin/remorques/nouveau"
                    className="btn-primary"
                    style={{ textDecoration: 'none', width: 'auto', display: 'inline-block' }}
                >
                    Ajouter une Remorque
                </Link>
            </div>
            {error && <p className="error-text">{error}</p>}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
                <div>
                    <label style={{ marginRight: '6px', fontSize: '0.9em', fontWeight: 600 }}>Type :</label>
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="Tous">Tous les types</option>
                        <option value="plateau">Plateau</option>
                        <option value="citerne">Citerne</option>
                        <option value="benne">Benne</option>
                        <option value="frigo">Frigo</option>
                    </select>
                </div>
            </div>
            {isLoading && <p>Chargement des remorques en cours...</p>}
            {!isLoading && filteredRemorques.length === 0 && (
                <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>
                    Aucune remorque trouvée.
                </p>
            )}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
                {filteredRemorques.map((remorque) => (
                    <div key={remorque._id || remorque.id} className="truck-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{remorque.immatriculation}</h4>
                            <span className={`status-badge ${remorque.statut || 'disponible'}`}>
                                {remorque.statut || 'disponible'}
                            </span>
                        </div>
                        <div style={{ margin: '8px 0', color: '#475569', fontSize: '0.95rem' }}>
                            <p><strong>Type :</strong> {remorque.type}</p>
                            <p><strong>Capacité :</strong> {remorque.capaciteCharge} kg</p>
                            <p><strong>Kilométrage :</strong> {remorque.kilometrageActuel || 0} km</p>
                        </div>
                        <div style={{ marginTop: '12px', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                            <Link
                                to={`/admin/remorques/${remorque._id || remorque.id}`}
                                style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.9rem' }}
                            >
                                Gérer / Détails -{'>'}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

}


