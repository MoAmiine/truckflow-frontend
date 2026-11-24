import './App.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import { apiRequest } from './services/api';
import AdminLayout from './components/AdminLayout';
import DriverLayout from './components/DriverLayout';
import DriverTrajets from './components/DriverTrajets';
import UserList from './components/UserList';
import TruckList from './components/TruckList';
import RemorqueList from './components/RemorqueList';
import RemorqueForm from './components/RemorqueForm';
import RemorqueDetail from './components/RemorqueDetail';
import RequireAuth from './components/RequireAuth';
import RequireRole from './components/RequireRole';
import Forbidden from './components/Forbidden';
import NotFound from './components/NotFound';
import TrajetList from './components/TrajetList';
import TrajetForm from './components/TrajetForm';
import TrajetDetail from './components/TrajetDetail';



function App() {
  const [session, setSession] = useState(null);

  const handleLogin = (result) => {
    setSession(result.data);
  };

  const handleLogout = async () => {
    try {
      if (session?.accessToken) {
        await apiRequest('/auth/logout', {
          method: 'POST',
          token: session.accessToken
        });
      }
    } catch (err) {
      console.error('Erreur lors du logout:', err.message);
    } finally {
      setSession(null);
    }
  };

  return (
    <div className="app-container">
      <h1 className="app-title">TruckFlow — Gestion de Flotte</h1>

      <Routes>
        <Route
          path="/"
          element={
            !session ? (
              <Navigate to="/login" replace />
            ) : session.role === 'admin' ? (
              <Navigate to="/admin/camions" replace />
            ) : (
              <Navigate to="/chauffeur/trajets" replace />
            )
          }
        />

        <Route path="/login" element={<LoginForm onlogin={handleLogin} />} />

        <Route
          path="/admin"
          element={
            <RequireAuth session={session}>
              <RequireRole session={session} allowedRoles={['admin']}>
                <AdminLayout session={session} onLogout={handleLogout} />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/admin/camions" replace />} />
          <Route path="camions" element={<TruckList session={session} />} />
          <Route path="utilisateurs" element={<UserList session={session} />} />
          <Route path="remorques" element={<RemorqueList session={session} />} />
          <Route path="remorques/nouveau" element={<RemorqueForm session={session} />} />
          <Route path="remorques/:id" element={<RemorqueDetail session={session} />} />
          <Route path="trajets" element={<TrajetList session={session}/>} />
          <Route path="trajets/nouveau" element={<TrajetForm session={session} />} />
          <Route path="trajets/:id" element={<TrajetDetail session={session}/>}/>
        </Route>

        <Route
          path="/chauffeur"
          element={
            <RequireAuth session={session}>
              <RequireRole session={session} allowedRoles={['chauffeur']}>
                <DriverLayout session={session} onLogout={handleLogout} />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/chauffeur/trajets" replace />} />
          <Route path="trajets" element={<DriverTrajets session={session} />} />
        </Route>

        <Route path="/403" element={<Forbidden session={session} />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
