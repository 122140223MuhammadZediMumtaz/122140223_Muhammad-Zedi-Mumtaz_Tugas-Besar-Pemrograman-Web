import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import Barang from './components/Barang';
import Profile from './components/Profile';  // pastikan file Profile.js sudah dibuat
import { useAuth } from './context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/" />;

  if (roles && !roles.includes(user.role)) return <Navigate to="/dashboard" />;

  return children;
};

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/barang"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <Barang />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute roles={['admin', 'user']}>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
