import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiRequest } from "../services/api";


export default function TrajetForm({ session }) {
    const navigate = useNavigate();

    const [chauffeurs, setChauffeurs] = useState([]);
    const [camions, setCamions] = useState([]);
    const [remorques, setRemorques] = useState([]);
    const [siteDepart, setSiteDepart] = useState('');
    const [siteArrivee, setSiteArrivee] = useState('');
    const [marchandise, setMarchandise] = useState('');
    const [dateDepartPrevue, setDateDepartPrevue] = useState('');
    const [dateArriveePrevue, setDateArriveePrevue] = useState('');
    const [chauffeurId, setChauffeurId] = useState('');
    const [camionId, setCamionId] = useState('');
    const [remorqueId, setRemorqueId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const [usersRes, trucksRes, trailersRes] = await Promise.all([
                    apiRequest('/users', { token: session?.accessToken }),
                    apiRequest('/camions', { token: session?.accessToken }),
                    apiRequest('/remorques', { token: session?.accessToken })
                ]);
                const chauffeursActifs = (usersRes.data || []).filter(
                    (u) => u.role === 'chauffeur' && u.statut === 'actif'
                );
                setChauffeurs(chauffeursActifs);
                setCamions(trucksRes.data || []);
                setRemorques(trailersRes.data || []);
            } catch (err) {
                setError('Impossible de charger les ressources disponibles');
            }
        };
        fetchResources();
    }, [session?.accessToken]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await apiRequest('/trajets', {
                method: 'POST',
                token: session?.accessToken,
                body: JSON.stringify({
                    siteDepart,
                    siteArrivee,
                    marchandise,
                    dateDepartPrevue,
                    dateArriveePrevue,
                    chauffeurId,
                    camionId,
                    remorqueId
                })
            });
            navigate('/admin/trajets');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '700px', margin: '20px auto', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Planifier un Nouveau Trajet</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                    Renseignez les détails du trajet et assignez les ressources disponibles.
                </p>
            </div>

            {error && <p className="error-text">{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                    <label>Site de Départ :</label>
                    <input
                        type="text"
                        placeholder="ex: Casablanca"
                        value={siteDepart}
                        onChange={(e) => setSiteDepart(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Site d'Arrivée :</label>
                    <input
                        type="text"
                        placeholder="ex: Tanger"
                        value={siteArrivee}
                        onChange={(e) => setSiteArrivee(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Marchandise :</label>
                    <input
                        type="text"
                        placeholder="ex: Produits alimentaires frais"
                        value={marchandise}
                        onChange={(e) => setMarchandise(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Date & Heure Départ Prévue :</label>
                    <input
                        type="datetime-local"
                        value={dateDepartPrevue}
                        onChange={(e) => setDateDepartPrevue(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Date & Heure Arrivée Prévue :</label>
                    <input
                        type="datetime-local"
                        value={dateArriveePrevue}
                        onChange={(e) => setDateArriveePrevue(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                    <h4 style={{ margin: '0 0 12px', fontSize: '1rem', color: '#1e293b' }}>Assignation des Ressources</h4>
                </div>

                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Chauffeur assigné :</label>
                    <select value={chauffeurId} onChange={(e) => setChauffeurId(e.target.value)} required>
                        <option value="">-- Choisir un chauffeur actif --</option>
                        {chauffeurs.map((c) => (
                            <option key={c._id || c.id} value={c._id || c.id}>
                                {c.prenom} {c.nom} ({c.email})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Camion assigné :</label>
                    <select value={camionId} onChange={(e) => setCamionId(e.target.value)} required>
                        <option value="">-- Choisir un camion --</option>
                        {camions.map((k) => (
                            <option key={k._id || k.id} value={k._id || k.id}>
                                {k.immatriculation} ({k.marque} {k.modele})
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Remorque assignée :</label>
                    <select value={remorqueId} onChange={(e) => setRemorqueId(e.target.value)} required>
                        <option value="">-- Choisir une remorque --</option>
                        {remorques.map((r) => (
                            <option key={r._id || r.id} value={r._id || r.id}>
                                {r.immatriculation} ({r.type} - {r.capaciteCharge}kg)
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '12px', marginTop: '16px' }}>
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={isLoading}>
                        {isLoading ? 'Planification en cours...' : 'Planifier et Assigner le Trajet'}
                    </button>

                    <Link
                        to="/admin/trajets"
                        style={{
                            textDecoration: 'none',
                            color: '#475569',
                            background: '#f1f5f9',
                            padding: '10px 18px',
                            borderRadius: '6px',
                            border: '1px solid #cbd5e1',
                            fontWeight: 500,
                            display: 'inline-flex',
                            alignItems: 'center'
                        }}
                    >
                        Annuler
                    </Link>
                </div>
            </form>
        </div>
    );
} 