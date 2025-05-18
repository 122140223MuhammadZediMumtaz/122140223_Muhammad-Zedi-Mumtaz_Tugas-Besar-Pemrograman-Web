import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // default user
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const res = register({ email, password, role });
    if (res.success) {
      alert('Registrasi berhasil! Silakan login.');
      navigate('/');
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white rounded shadow-md"
      >
        <h2 className="mb-6 text-2xl font-semibold text-center">Register StockSphere</h2>

        {error && (
          <div className="p-2 mb-4 text-red-800 bg-red-200 rounded">{error}</div>
        )}

        <label className="block mb-2">Email</label>
        <input
          type="email"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="email@example.com"
        />

        <label className="block mb-2">Password</label>
        <input
          type="password"
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />

        <label className="block mb-2">Role</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 mb-6 border border-gray-300 rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
