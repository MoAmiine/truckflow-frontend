import { useState } from 'react';
import { apiRequest } from '../services/api';

function UserForm({ session, onUserCreated }) {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nom.trim() || !prenom.trim() || !email.trim() || !motDePasse.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      const result = await apiRequest('/users/chauffeurs', {
        method: 'POST',
        token: session.accessToken,
        body: JSON.stringify({ nom, prenom, email, motDePasse })
      });

      if (onUserCreated) {
        onUserCreated(result.data);
      }

      setNom('');
      setPrenom('');
      setEmail('');
      setMotDePasse('');
      setSuccessMsg('Chauffeur créé avec succès !');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ddd', padding: '16px', borderRadius: '8px', background: '#fdfdfd', marginBottom: '20px' }}>
      <h4>Ajouter un Nouveau Chauffeur</h4>

      {error && <p style={{ color: 'red', margin: '8px 0' }}>{error}</p>}
      {successMsg && <p style={{ color: 'green', margin: '8px 0' }}>{successMsg}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '4px' }}>Nom :</label>
          <input
            type="text"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '4px' }}>Prénom :</label>
          <input
            type="text"
            value={prenom}
            onChange={(e) => setPrenom(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '4px' }}>Email :</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.9em', marginBottom: '4px' }}>Mot de passe (min 6 car.) :</label>
          <input
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
            required
          />
        </div>

        <div style={{ gridColumn: 'span 2', marginTop: '6px' }}>
          <button type="submit" disabled={isLoading} style={{ padding: '8px 16px', cursor: 'pointer' }}>
            {isLoading ? 'Création en cours...' : 'Enregistrer le Chauffeur'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;