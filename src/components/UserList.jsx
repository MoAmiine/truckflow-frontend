import { useState } from 'react';
import { apiRequest } from '../services/api';
import UserCard from './UserCard';
import UserForm from './UserForm';

function UserList({ session }) {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);
  
  const [roleFilter, setRoleFilter] = useState('Tous');
  const [statusFilter, setStatusFilter] = useState('Tous');

  const [selectedUser, setSelectedUser] = useState(null);

  const handleLoadUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/users', { token: session.accessToken });
      setUsers(result.data || []);
      setHasLoaded(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserCreated = (newUser) => {
    setUsers((prev) => [newUser, ...prev]);
  };

  const handleToggleStatut = async (user) => {
    const newStatut = user.statut === 'actif' ? 'suspendu' : 'actif';
    try {
      await apiRequest(`/users/${user._id || user.id}/statut`, {
        method: 'PATCH',
        token: session.accessToken,
        body: JSON.stringify({ statut: newStatut })
      });

      setUsers((prev) =>
        prev.map((u) => ((u._id || u.id) === (user._id || user.id) ? { ...u, statut: newStatut } : u))
      );

      setSelectedUser((prev) =>
        prev && (prev._id || prev.id) === (user._id || user.id) ? { ...prev, statut: newStatut } : prev
      );
    } catch (err) {
      alert(`Erreur lors du changement de statut: ${err.message}`);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchRole = roleFilter === 'Tous' || u.role === roleFilter;
    const matchStatus = statusFilter === 'Tous' || u.statut === statusFilter;
    return matchRole && matchStatus;
  });

  return (
    <div className="user-management">
      <UserForm session={session} onUserCreated={handleUserCreated} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3>👥 Gestion des Utilisateurs ({filteredUsers.length})</h3>
        <button onClick={handleLoadUsers} disabled={isLoading}>
          {isLoading ? 'Chargement...' : 'Charger / Actualiser'}
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', background: '#f8f9fa', padding: '10px', borderRadius: '6px' }}>
        <div>
          <label style={{ marginRight: '6px', fontSize: '0.9em' }}>Rôle :</label>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="Tous">Tous les rôles</option>
            <option value="admin">Administrateur</option>
            <option value="chauffeur">Chauffeur</option>
          </select>
        </div>

        <div>
          <label style={{ marginRight: '6px', fontSize: '0.9em' }}>Statut :</label>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="Tous">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="suspendu">Suspendu</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div>
          {hasLoaded && !isLoading && filteredUsers.length === 0 && (
            <p>Aucun utilisateur trouvé avec ces filtres.</p>
          )}

          {filteredUsers.map((u) => (
            <UserCard
              key={u._id || u.id}
              user={u}
              onSelect={setSelectedUser}
              isSelected={selectedUser?._id === u._id}
            />
          ))}
        </div>

        <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', background: '#fff', height: 'fit-content' }}>
          <h4>📄 Détails de l'utilisateur</h4>
          {selectedUser ? (
            <div>
              <p><strong>Nom complet :</strong> {selectedUser.prenom} {selectedUser.nom}</p>
              <p><strong>Email :</strong> {selectedUser.email}</p>
              <p><strong>Téléphone :</strong> {selectedUser.telephone || 'Non renseigné'}</p>
              <p><strong>Rôle :</strong> {selectedUser.role}</p>
              <p><strong>Statut :</strong> {selectedUser.statut}</p>
              <p><strong>Identifiant :</strong> <code>{selectedUser._id || selectedUser.id}</code></p>

              {selectedUser.role === 'chauffeur' && (
                <div style={{ marginTop: '16px' }}>
                  <button
                    onClick={() => handleToggleStatut(selectedUser)}
                    style={{
                      background: selectedUser.statut === 'actif' ? '#dc3545' : '#28a745',
                      color: '#fff',
                      border: 'none',
                      padding: '8px 14px',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedUser.statut === 'actif' ? '🚫 Suspendre le Chauffeur' : '✅ Réactiver le Chauffeur'}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p style={{ color: '#888' }}>Cliquez sur un utilisateur à gauche pour afficher ses détails.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserList;