import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <nav className="flex items-center justify-between p-4 text-white bg-blue-600">
      <div className="text-xl font-bold">StockSphere</div>
      <div className="space-x-4">
        {!user && (
          <>
            <Link to="/">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        {user && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/barang">Barang</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
