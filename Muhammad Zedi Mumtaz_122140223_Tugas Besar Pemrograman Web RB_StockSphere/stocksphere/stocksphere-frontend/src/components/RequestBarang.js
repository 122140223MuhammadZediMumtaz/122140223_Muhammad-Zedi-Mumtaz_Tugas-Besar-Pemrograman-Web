import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRequest } from '../context/RequestContext';

const RequestBarang = ({ items, updateItemStock }) => {
  const { user } = useAuth();
  const { requests, addRequest, updateRequestStatus, deleteRequest } = useRequest();

  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');

  // Filter barang list yang ada stok > 0
  const availableItems = items.filter(item => item.stock > 0);

  // Handler submit request baru (user biasa)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBarangId) {
      setError('Pilih barang terlebih dahulu');
      return;
    }
    const barang = availableItems.find(i => i.id.toString() === selectedBarangId);
    const qty = Number(quantity);

    if (!qty || qty <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    if (qty > barang.stock) {
      setError(`Jumlah maksimal ${barang.stock}`);
      return;
    }

    // Buat request baru
    addRequest({
      userEmail: user.email,
      barangId: barang.id,
      barangName: barang.name,
      quantity: qty,
      status: 'pending',
    });

    setSelectedBarangId('');
    setQuantity('');
    setError('');
  };

  // Admin hanya untuk lihat dan update status request
  const handleConfirm = (id) => {
    updateRequestStatus(id, 'confirmed');
  };

  const handleShip = (id) => {
    // Kurangi stok barang sesuai quantity request
    const req = requests.find(r => r.id === id);
    if (req) {
      updateItemStock(req.barangId, req.quantity);
      updateRequestStatus(id, 'shipped');
    }
  };

  // User bisa batal request (hanya yang status pending)
  const handleCancel = (id) => {
    deleteRequest(id);
  };

  // Tampilkan request yang relevan:
  // User: request sendiri  
  // Admin: semua request
  const visibleRequests = user.role === 'admin' 
    ? requests 
    : requests.filter(r => r.userEmail === user.email);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Request Barang</h2>

      {user.role === 'user' && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow max-w-md">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Pilih Barang</label>
            <select
              value={selectedBarangId}
              onChange={(e) => setSelectedBarangId(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              required
            >
              <option value="">-- Pilih Barang --</option>
              {availableItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} (Stok: {item.stock})
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 font-medium">Jumlah</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="w-full p-2 border border-gray-300 rounded"
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-600 font-semibold">{error}</div>
          )}

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Kirim Request
          </button>
        </form>
      )}

      <h3 className="text-xl font-semibold mb-2">Daftar Request</h3>
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3">ID</th>
            <th className="text-left px-6 py-3">Barang</th>
            <th className="text-left px-6 py-3">Jumlah</th>
            <th className="text-left px-6 py-3">Pemohon</th>
            <th className="text-left px-6 py-3">Status</th>
            <th className="text-left px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {visibleRequests.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-6">
                Belum ada request.
              </td>
            </tr>
          ) : (
            visibleRequests.map((r) => (
              <tr key={r.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{r.id}</td>
                <td className="px-6 py-4">{r.barangName}</td>
                <td className="px-6 py-4">{r.quantity}</td>
                <td className="px-6 py-4">{r.userEmail}</td>
                <td className="px-6 py-4 capitalize">{r.status}</td>
                <td className="px-6 py-4 space-x-2">
                  {user.role === 'admin' ? (
                    <>
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleConfirm(r.id)}
                          className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                        >
                          Konfirmasi
                        </button>
                      )}
                      {r.status === 'confirmed' && (
                        <button
                          onClick={() => handleShip(r.id)}
                          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                          Kirim Barang
                        </button>
                      )}
                    </>
                  ) : (
                    r.status === 'pending' && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Batal Request
                      </button>
                    )
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestBarang;
