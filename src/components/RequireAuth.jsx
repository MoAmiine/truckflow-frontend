import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function RequireAuth({ children }) {
  const location = useLocation();
  const { session } = useAuth()
  if (!session) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
