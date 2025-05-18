import React from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div className="container p-6 mx-auto">
      <h2 className="mb-4 text-3xl font-semibold">Selamat datang di StockSphere!</h2>
      <p className="mb-6">Gunakan menu untuk mengelola data dan lihat fitur yang tersedia.</p>

      <div className="flex space-x-6">
        <Link
          to="/barang"
          className="px-6 py-4 text-white transition bg-blue-600 rounded shadow hover:bg-blue-700"
        >
          Kelola Barang
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
