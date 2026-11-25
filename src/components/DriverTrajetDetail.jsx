import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { apiRequest } from "../services/api";

export default function DriverTrajet({ session }) {
    const { id } = useParams();
    const [trajet, setTrajet] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [actionError, setActionError] = useState(null);
    const [kmDepart, setKmDepart] = useState('');
    const [kmArrivee, setKmArrivee] = useState('');
    const [volumeGasoil, setVolumeGasoil] = useState('');
    const [coutGasoil, setCoutGasoil] = useState('');

    useEffect(() => {
        const fetchTrajet = async () => {
            try {
                const result = await apiRequest(`/trajets/${id}`, { token: session?.accessToken })
                setTrajet(result.data)

            } catch (err) {
                setError(err.message)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTrajet()
    }, [id, session?.accessToken])

    const handleDemarrer = async () => {
        setActionLoading(true);
        setActionError(null);
        try {
            const result = await apiRequest(`/trajets/${id}/demarrer`, { method: 'PATCH', token: session?.accessToken })
            setTrajet(result.data);
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(false)
        }
    }

    const handleCloturer = async (e) => {
        e.preventDefault();
        setActionLoading(true)
        setActionError(null)
        try {
            const result = await apiRequest(`/trajets/${id}/cloturer`, {
                method: 'PATCH',
                token: session?.accessToken,
                body: JSON.stringify({
                    kilometrageDepart: Number(kmDepart),
                    kilometrageArrivee: Number(kmArrivee),
                    volumeGasoil: Number(volumeGasoil)
                })
            })
            setTrajet(result.data);
        } catch (err) {
            setActionError(err.message);
        } finally {
            setActionLoading(false);
        }
    }

    return (
        <div style={{ maxWidth: '750px', margin: '20px auto', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '16px' }}>
                <Link
                    to="/chauffeur/trajets"
                    style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 500, fontSize: '0.9rem' }}
                >
                    &larr; Retour a mes missions
                </Link>
            </div>

            {isLoading && <p>Chargement des details de la mission...</p>}

            {error && <p className="error-text">{error}</p>}

            {!isLoading && !error && trajet && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
                                {trajet.siteDepart || trajet.lieuDepart} &rarr; {trajet.siteArrivee || trajet.destination}
                            </h3>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                                Mission ID : <code>{trajet._id || id}</code>
                            </p>
                        </div>
                        <span className={`status-badge ${trajet.statut}`}>
                            {trajet.statut}
                        </span>
                    </div>

                    <div style={{ margin: '20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '0.95rem' }}>
                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Marchandise :</p>
                            <p><strong>{trajet.marchandise || 'Non specifiee'}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Depart prevu :</p>
                            <p><strong>{trajet.dateDepartPrevue ? new Date(trajet.dateDepartPrevue).toLocaleString() : 'Non definie'}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Camion :</p>
                            <p><strong>{trajet.camionId?.immatriculation || 'Non assigne'} {trajet.camionId?.marque ? `(${trajet.camionId.marque})` : ''}</strong></p>
                        </div>

                        <div>
                            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '2px' }}>Remorque :</p>
                            <p><strong>{trajet.remorqueId?.immatriculation || 'Non assignee'} {trajet.remorqueId?.type ? `(${trajet.remorqueId.type})` : ''}</strong></p>
                        </div>
                    </div>

                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '20px', marginTop: '20px' }}>
                        <h4 style={{ margin: '0 0 12px', fontSize: '1.1rem', color: '#1e293b' }}>
                            Actions de la Mission
                        </h4>

                        {actionError && <p className="error-text">{actionError}</p>}

                        {trajet.statut === 'a_faire' && (
                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 12px', color: '#475569', fontSize: '0.95rem' }}>
                                    Vous etes pret a partir ? Demarrez la mission pour notifier le systeme.
                                </p>
                                <button
                                    onClick={handleDemarrer}
                                    disabled={actionLoading}
                                    className="btn-primary"
                                    style={{ width: 'auto' }}
                                >
                                    {actionLoading ? 'Demarrage en cours...' : 'Demarrer la mission'}
                                </button>
                            </div>
                        )}

                        {trajet.statut === 'en_cours' && (
                            <form onSubmit={handleCloturer} style={{ background: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                                <p style={{ margin: '0 0 16px', color: '#475569', fontSize: '0.95rem', fontWeight: 600 }}>
                                    Mission en cours — Saisie de cloture a l'arrivee :
                                </p>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                    <div className="form-group">
                                        <label>Kilometrage Depart (km) :</label>
                                        <input
                                            type="number"
                                            value={kmDepart}
                                            onChange={(e) => setKmDepart(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Kilometrage Arrivee (km) :</label>
                                        <input
                                            type="number"
                                            value={kmArrivee}
                                            onChange={(e) => setKmArrivee(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Volume Gasoil consomme (L) :</label>
                                        <input
                                            type="number"
                                            step="0.1"
                                            value={volumeGasoil}
                                            onChange={(e) => setVolumeGasoil(e.target.value)}
                                            required
                                            min="0"
                                        />
                                    </div>
                                </div>

                                <div style={{ marginTop: '16px' }}>
                                    <button
                                        type="submit"
                                        disabled={actionLoading}
                                        className="btn-primary"
                                        style={{ width: 'auto', background: '#16a34a' }}
                                    >
                                        {actionLoading ? 'Cloture en cours...' : 'Valider et Cloturer la Mission'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {trajet.statut === 'termine' && (
                            <div style={{ background: '#f0fdf4', padding: '16px', borderRadius: '6px', border: '1px solid #bbf7d0', color: '#166534' }}>
                                <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>
                                    Cette mission a ete cloturee avec succes.
                                </p>
                                <div style={{ marginTop: '10px', fontSize: '0.9rem', display: 'flex', gap: '20px' }}>
                                    <span>Km Depart : <strong>{trajet.kilometrageDepart || '-'}</strong></span>
                                    <span>Km Arrivee : <strong>{trajet.kilometrageArrivee || '-'}</strong></span>
                                    <span>Gasoil : <strong>{trajet.volumeGasoil ? `${trajet.volumeGasoil} L` : '-'}</strong></span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}