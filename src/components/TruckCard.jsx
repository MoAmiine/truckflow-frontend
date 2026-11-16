function TruckCard({ truck, onEdit, onArchive }) {
  return (
    <div className="truck-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{truck.immatriculation}</h4>
        <span className={`status-badge ${truck.statut}`}>{truck.statut}</span>
      </div>

      <div style={{ margin: '8px 0', color: '#475569', fontSize: '0.95rem' }}>
        <p><strong>Marque / Modèle :</strong> {truck.marque} {truck.modele}</p>
        <p><strong>Kilométrage :</strong> {truck.kilometrageActuel || 0} km</p>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
        <button 
          onClick={() => onEdit(truck)}
          style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '5px 12px', fontSize: '0.85rem' }}
        >
          Modifier
        </button>
        <button 
          onClick={() => onArchive(truck)}
          style={{ background: '#fee2e2', color: '#b91c1c', border: '1px solid #fca5a5', padding: '5px 12px', fontSize: '0.85rem' }}
        >
          Archiver
        </button>
      </div>
    </div>
  );
}

export default TruckCard;