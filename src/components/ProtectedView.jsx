function ProtectedView({ session, allowedRoles, children }) {
  if (!session || !allowedRoles.includes(session.role)) {
    return (
      <div className="access-denied">
        <h3>Accès Refusé</h3>
        <p>Votre rôle ({session?.role || 'Inconnu'}) n'a pas l'autorisation d'accéder à cette section.</p>
      </div>
    );
  }
  return children;
}
export default ProtectedView;
