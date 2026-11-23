import { useState } from 'react';
import { apiRequest } from '../services/api';
import { useNavigate, Link } from "react-router-dom";

export default function RemorqueForm({ session }) {
    const navigate = useNavigate();
    const [immatriculation, setImmatriculation] = useState('');
    const [type, setType] = useState('plateau');
    const [capaciteCharge, setCapaciteCharge] = useState('');
    const [kilometrageActuel, setKilometrageActuel] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        try {
            await apiRequest('/remorques', {
                method: 'POST',
                token: session?.accessToken,
                body: JSON.stringify({
                    immatriculation: immatriculation.trim(),
                    type: type,
                    capaciteCharge: Number(capaciteCharge),
                    kilometrageActuel: Number(kilometrageActuel) || 0
                })
            });
            navigate('/admin/remorques');
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', background: '#fff', padding: '24px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>Ajouter une Nouvelle Remorque</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '4px' }}>
                    Remplissez les informations pour enregistrer la remorque dans le parc.
                </p>
            </div>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Immatriculation :</label>
                    <input
                        type="text"
                        placeholder="ex: R-12345-B"
                        value={immatriculation}
                        onChange={(e) => setImmatriculation(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Type de Remorque :</label>
                    <select value={type} onChange={(e) => setType(e.target.value)} required>
                        <option value="plateau">Plateau</option>
                        <option value="citerne">Citerne</option>
                        <option value="benne">Benne</option>
                        <option value="frigo">Frigo</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Capacité de Charge (en kg) :</label>
                    <input
                        type="number"
                        placeholder="ex: 25000"
                        min="1"
                        value={capaciteCharge}
                        onChange={(e) => setCapaciteCharge(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Kilométrage Actuel :</label>
                    <input
                        type="number"
                        min="0"
                        value={kilometrageActuel}
                        onChange={(e) => setKilometrageActuel(e.target.value)}
                    />
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                    <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={isLoading}>
                        {isLoading ? 'Enregistrement en cours...' : 'Enregistrer la Remorque'}
                    </button>

                    <Link
                        to="/admin/remorques"
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


