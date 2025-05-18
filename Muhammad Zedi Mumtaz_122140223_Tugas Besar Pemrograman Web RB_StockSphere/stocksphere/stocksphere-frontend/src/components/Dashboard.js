import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Dashboard.css'; // pastikan path sesuai


const Dashboard = () => {
  return (
    <div className="dashboard-background">
    <div className="dashboard-content">
    <div>
      <h2 className="mb-3 text-5xl font-semibold text-center">Selamat datang di StockSphere!</h2>
      <h3 className="mb-3 text-3xl text-center font-arial">Solusi Pintar Manajemen Inventaris Anda</h3>
      <p className="mb-3 text-center">Gunakan menu untuk mengelola data dan lihat fitur yang tersedia.</p>

      <Link
        to="/barang"
        className="px-6 py-4 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700"
      >
        Kelola Barang
      </Link>
    </div>
    </div>
    </div>
  );
};

export default Dashboard;