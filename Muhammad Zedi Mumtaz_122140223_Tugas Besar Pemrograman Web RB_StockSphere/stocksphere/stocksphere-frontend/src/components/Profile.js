import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Profile.css';

const Profile = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // State untuk handle form password
  const [form, setForm] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validasi dan submit form password
    alert('Perubahan disimpan!');
  };

  return (
    <div className="profile-page">
      {/* Hapus div profile-sidebar supaya kotak abu hilang */}
      <div className="profile-content">
        <h2>Edit Profil</h2>
        <form className="profile-form" onSubmit={handleSubmit}>
          <h3>Ubah Password</h3>
          <div>
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleInputChange}
              placeholder="Masukkan Password Baru"
            />
          </div>

          <div>
            <label>Konfirmasi Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleInputChange}
              placeholder="Konfirmasi Password Baru"
            />
          </div>

          <button type="submit" className="btn-submit">
            Simpan Perubahan
          </button>
        </form>
        {/* Tombol logout di bawah tombol submit */}
        <button
        onClick={handleLogout}
        className="btn-logout"
      >
        Logout
      </button>
      </div>
    </div>
  );
};

export default Profile;