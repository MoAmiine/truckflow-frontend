import { useState, useEffect } from "react";
import { useParams, Navigate, Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function RemorqueDetails({ session }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [remorque, setRemorque] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        const fetchDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await apiRequest(`/remorques/${id}`, {
                    token: session?.accessToken,
                    signal: controller.signal
                });
                setRemorque(result.data);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message || 'Remorque introuvable');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchDetail();
        return () => controller.abort();
    }, [id, session?.accessToken]);

    const handleArchive = async () => {
        const confirmed = window.confirm(`Voulez-vous vraiment archiver cette remorque ?`);
        if (!confirmed) return;

        try {
            await apiRequest(`/remorques/${id}`, {
                method: 'DELETE',
                token: session?.accessToken
            });
            navigate('/admin/remorques');
        } catch (err) {
            alert(`Erreur lors de l'archivage: ${err.message}`);
        }
    };

    return (
        <div style={{ maxWidth: '650px', margin: '20px auto', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '16px' }}>
                <Link
                    to="/admin/remorques"
                    style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}
                >
                    &larr; Retour à la liste des remorques
                </Link>
            </div>

            {isLoading && <p>Chargement des détails de la remorque...</p>}

            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && remorque && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <h3 style={{ margin: 0, fontSize: '1.4rem' }}>{remorque.immatriculation}</h3>
                        <span className={`status-badge ${remorque.statut || 'disponible'}`}>
                            {remorque.statut || 'disponible'}
                        </span>
                    </div>

                    <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.95rem' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Type :</p>
                            <p><strong>{remorque.type}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Capacité de charge :</p>
                            <p><strong>{remorque.capaciteCharge} kg</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Kilométrage actuel :</p>
                            <p><strong>{remorque.kilometrageActuel || 0} km</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Identifiant interne :</p>
                            <p><code style={{ fontSize: '0.85rem' }}>{remorque._id || id}</code></p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '24px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                        <button
                            onClick={handleArchive}
                            style={{
                                background: '#fee2e2',
                                color: '#b91c1c',
                                border: '1px solid #fca5a5',
                                padding: '8px 16px',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: 500
                            }}
                        >
                            Archiver cette Remorque
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}