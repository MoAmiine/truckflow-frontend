import { useState } from 'react';
import { apiRequest } from '../services/api';

function TruckForm({ session, truckToEdit, onSaved, onCancel }) {
  const [immatriculation, setImmatriculation] = useState(truckToEdit?.immatriculation || '');
  const [marque, setMarque] = useState(truckToEdit?.marque || '');
  const [modele, setModele] = useState(truckToEdit?.modele || '');
  const [kilometrageActuel, setKilometrageActuel] = useState(truckToEdit?.kilometrageActuel ?? 0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const isEditing = Boolean(truckToEdit);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!immatriculation.trim() || !marque.trim() || !modele.trim()) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const payload = {
      immatriculation: immatriculation.trim(),
      marque: marque.trim(),
      modele: modele.trim(),
      kilometrageActuel: Number(kilometrageActuel) || 0
    };

    try {
      let result;
      if (isEditing) {
        result = await apiRequest(`/camions/${truckToEdit._id || truckToEdit.id}`, {
          method: 'PUT',
          token: session.accessToken,
          body: JSON.stringify(payload)
        });
      } else {
        result = await apiRequest('/camions', {
          method: 'POST',
          token: session.accessToken,
          body: JSON.stringify(payload)
        });
      }

      const savedCamion = result.camion || result.data || { ...(truckToEdit || {}), ...payload };
      if (onSaved) {
        onSaved(savedCamion, isEditing);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'enregistrement du camion');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '18px', borderRadius: '8px', background: '#fdfdfd', marginBottom: '20px' }}>
      <h4>{isEditing ? 'Modifier le Camion' : 'Ajouter un Nouveau Camion'}</h4>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginTop: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>Immatriculation :</label>
          <input
            type="text"
            value={immatriculation}
            onChange={(e) => setImmatriculation(e.target.value)}
            placeholder="ex: 12345-A-6"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>Marque :</label>
          <input
            type="text"
            value={marque}
            onChange={(e) => setMarque(e.target.value)}
            placeholder="ex: Volvo"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>Modèle :</label>
          <input
            type="text"
            value={modele}
            onChange={(e) => setModele(e.target.value)}
            placeholder="ex: FH16"
            required
            style={{ width: '100%' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '4px' }}>Kilométrage actuel :</label>
          <input
            type="number"
            min="0"
            value={kilometrageActuel}
            onChange={(e) => setKilometrageActuel(e.target.value)}
            style={{ width: '100%' }}
          />
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px', marginTop: '8px' }}>
          <button type="submit" className="btn-primary" style={{ width: 'auto' }} disabled={isLoading}>
            {isLoading ? 'Enregistrement...' : isEditing ? 'Mettre à jour' : 'Créer le camion'}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel} style={{ background: '#f1f5f9', border: '1px solid #cbd5e1' }}>
              Annuler
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default TruckForm;
