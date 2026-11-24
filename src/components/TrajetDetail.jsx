import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function TrajetDetail({ session }) {
    const { id } = useParams()
    const [trajet, setTrajet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const result = await apiRequest(`/trajets/${id}`, {
                    token: session?.accessToken
                });
                setTrajet(result.data);
            } catch (err) {
                setError(err.message || 'Trajet introuvable');
            } finally {
                setIsLoading(false);
            }
        };
        fetchDetail();
    }, [id, session?.accessToken]);

    return (
        <div style={{ maxWidth: '750px', margin: '20px auto', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '16px' }}>
                <Link
                    to="/admin/trajets"
                    style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}
                >
                    &larr; Retour à la liste des trajets
                </Link>
            </div>

            {isLoading && <p>Chargement des détails du trajet...</p>}

            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && trajet && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
                                {trajet.siteDepart} &rarr; {trajet.siteArrivee}
                            </h3>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                                Mission ID : <code>{trajet._id || id}</code>
                            </p>
                        </div>
                        <span className={`status-badge ${trajet.statut || 'en_attente'}`}>
                            {trajet.statut || 'en attente'}
                        </span>
                    </div>

                    <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.95rem' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Marchandise :</p>
                            <p><strong>{trajet.marchandise || 'Non spécifiée'}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Départ prévu :</p>
                            <p><strong>{trajet.dateDepartPrevue ? new Date(trajet.dateDepartPrevue).toLocaleString() : 'Non définie'}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Arrivée prévue :</p>
                            <p><strong>{trajet.dateArriveePrevue ? new Date(trajet.dateArriveePrevue).toLocaleString() : 'Non définie'}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Départ effectif :</p>
                            <p><strong>{trajet.dateDepartEffective ? new Date(trajet.dateDepartEffective).toLocaleString() : 'Pas encore démarré'}</strong></p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', marginTop: '16px' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '1.05rem', color: '#1e293b' }}>
                            Ressources Assignées
                        </h4>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Chauffeur</span>
                                <p style={{ margin: '6px 0 2px', fontWeight: 600 }}>
                                    {trajet.chauffeurId ? `${trajet.chauffeurId.prenom} ${trajet.chauffeurId.nom}` : 'Non assigné'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                    {trajet.chauffeurId?.email || '-'}
                                </p>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Camion</span>
                                <p style={{ margin: '6px 0 2px', fontWeight: 600 }}>
                                    {trajet.camionId ? trajet.camionId.immatriculation : 'Non assigné'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                    {trajet.camionId ? `${trajet.camionId.marque} ${trajet.camionId.modele || ''}` : '-'}
                                </p>
                            </div>

                            <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 600 }}>Remorque</span>
                                <p style={{ margin: '6px 0 2px', fontWeight: 600 }}>
                                    {trajet.remorqueId ? trajet.remorqueId.immatriculation : 'Non assignée'}
                                </p>
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                                    {trajet.remorqueId ? `Type : ${trajet.remorqueId.type}` : '-'}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}