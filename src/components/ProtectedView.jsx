function ProtectedView({ session, allowedRoles, children }) {
  if (!session || !allowedRoles.includes(session.role)) {
    return (
      <div></div>
    );
  }
  return children;
}
export default ProtectedView;
