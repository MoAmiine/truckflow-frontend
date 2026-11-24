import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "../services/api";

function LoginForm({ onlogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const result = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      const userData = result.data;
      if (onlogin) {
        onlogin(result);
      }

      const requestedPath = location.state?.from?.pathname;
      const isAdminRoute = requestedPath?.startsWith('/admin');
      const isDriverRoute = requestedPath?.startsWith('/chauffeur');

      if (userData.role === 'admin') {
        const target = (!requestedPath || requestedPath === '/login' || isDriverRoute) ? '/admin/camions' : requestedPath;
        navigate(target, { replace: true });
      } else if (userData.role === 'chauffeur') {
        const target = (!requestedPath || requestedPath === '/login' || isAdminRoute) ? '/chauffeur/trajets' : requestedPath;
        navigate(target, { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-card">
      <h2>Connexion</h2>
      <p className="subtitle">Accédez à votre espace TruckFlow</p>

      {error && <p className="error-text">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Adresse Email</label>
          <input
            type="email"
            placeholder="ex: admin@truckflow.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Mot de passe</label>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn-primary" disabled={isLoading}>
          {isLoading ? 'Connexion en cours...' : 'Se connecter'}
        </button>
      </form>
    </div>
  );
}

export default LoginForm;
