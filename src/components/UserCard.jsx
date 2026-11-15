function UserCard({ user, onSelect, isSelected }) {
  return (
    <div 
      className={`user-card ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect && onSelect(user)}
      style={{
        border: isSelected ? '2px solid #007bff' : '1px solid #ccc',
        padding: '12px',
        margin: '8px 0',
        borderRadius: '6px',
        cursor: 'pointer'
      }}
    >
      <h4>{user.prenom} {user.nom}</h4>
      <p style={{ margin: '4px 0', color: '#666' }}>{user.email}</p>
      
      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
        <span style={{ background: '#e9ecef', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85em' }}>
          {user.role}
        </span>
        <span style={{ 
          background: user.statut === 'actif' ? '#d4edda' : '#f8d7da',
          color: user.statut === 'actif' ? '#155724' : '#721c24',
          padding: '2px 8px', 
          borderRadius: '4px', 
          fontSize: '0.85em' 
        }}>
          {user.statut}
        </span>
      </div>
    </div>
  );
}

export default UserCard;