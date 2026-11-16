import { useState } from 'react';
import { apiRequest } from '../services/api';
import TruckCard from './TruckCard';
import TruckForm from './TruckForm';

function TruckList({ session }) {
  const [trucks, setTrucks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [statusFilter, setStatusFilter] = useState('Tous');
  const [editingTruck, setEditingTruck] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleLoadTrucks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/camions', { token: session.accessToken });
      setTrucks(result.data || []);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des camions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedTruck = (saved, isEditing) => {
    if (isEditing) {
      setTrucks((prev) =>
        prev.map((t) => ((t._id || t.id) === (saved._id || saved.id) ? { ...t, ...saved } : t))
      );
    } else {
      setTrucks((prev) => [saved, ...prev]);
    }
    setIsCreating(false);
    setEditingTruck(null);
  };

  const handleArchive = async (truck) => {
    const confirmed = window.confirm(`Voulez-vous vraiment archiver le camion ${truck.immatriculation} ?`);
    if (!confirmed) return;

    try {
      await apiRequest(`/camions/${truck._id || truck.id}`, {
        method: 'DELETE',
        token: session.accessToken
      });
      setTrucks((prev) => prev.filter((t) => (t._id || t.id) !== (truck._id || truck.id)));
      if (editingTruck && (editingTruck._id || editingTruck.id) === (truck._id || truck.id)) {
        setEditingTruck(null);
      }
    } catch (err) {
      alert(`Erreur lors de l'archivage: ${err.message}`);
    }
  };

  const filteredTrucks = trucks.filter((t) => {
    if (statusFilter === 'Tous') return true;
    return t.statut === statusFilter;
  });

  return (
    <div className="truck-management">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <h3>Gestion du Parc Camions ({filteredTrucks.length})</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={handleLoadTrucks} disabled={isLoading}>
            {isLoading ? 'Chargement...' : 'Charger / Actualiser'}
          </button>
          {!isCreating && !editingTruck && (
            <button
              onClick={() => setIsCreating(true)}
              style={{ background: '#2563eb', color: '#fff', border: 'none' }}
            >
              Ajouter un Camion
            </button>
          )}
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {(isCreating || editingTruck) && (
        <TruckForm
          session={session}
          truckToEdit={editingTruck}
          onSaved={handleSavedTruck}
          onCancel={() => {
            setIsCreating(false);
            setEditingTruck(null);
          }}
        />
      )}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
        <div>
          <label style={{ marginRight: '6px', fontSize: '0.9em', fontWeight: 600 }}>Statut :</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Tous">Tous les camions</option>
            <option value="disponible">Disponible</option>
            <option value="en_mission">En mission</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      <div>
        {hasLoaded && !isLoading && filteredTrucks.length === 0 && (
          <p style={{ color: '#64748b', fontStyle: 'italic', margin: '20px 0' }}>
            Aucun camion trouvé pour ce statut.
          </p>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '14px' }}>
          {filteredTrucks.map((truck) => (
            <TruckCard
              key={truck._id || truck.id}
              truck={truck}
              onEdit={(t) => {
                setIsCreating(false);
                setEditingTruck(t);
              }}
              onArchive={handleArchive}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default TruckList;
