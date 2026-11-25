import './App.css';
import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
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
import DriverTrajet from './components/DriverTrajetDetail';
import { useAuth } from './context/AuthContext';



function App() {

  const { session, login, logout } = useAuth();

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

        <Route path="/login" element={<LoginForm onlogin={login} />} />

        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['admin']}>
                <AdminLayout />
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
          <Route path="trajets" element={<TrajetList session={session} />} />
          <Route path="trajets/nouveau" element={<TrajetForm session={session} />} />
          <Route path="trajets/:id" element={<TrajetDetail session={session} />} />

        </Route>

        <Route
          path="/chauffeur"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={['chauffeur']}>
                <DriverLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/chauffeur/trajets" replace />} />
          <Route path="trajets" element={<DriverTrajets session={session} />} />
          <Route path="trajets/:id" element={<DriverTrajet session={session} />} />
        </Route>

        <Route path="/403" element={<Forbidden />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
