import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export default function RequireRole({ allowedRoles, children }) {

  const { session } = useAuth();
  if (!session || !allowedRoles.includes(session.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
