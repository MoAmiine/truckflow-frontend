import { Navigate } from 'react-router-dom';

export default function RequireRole({ session, allowedRoles, children }) {
  if (!session || !allowedRoles.includes(session.role)) {
    return <Navigate to="/403" replace />;
  }

  return children;
}
