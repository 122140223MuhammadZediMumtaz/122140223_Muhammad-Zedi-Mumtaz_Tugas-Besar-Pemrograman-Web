import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import RequestBarang from './RequestBarang';

const Barang = () => {
  const { user } = useAuth();

  const [items, setItems] = useState([
    { id: 1, name: 'Sabun Mandi', stock: 20 },
    { id: 2, name: 'Shampoo', stock: 5 },
    { id: 3, name: 'Sikat Gigi', stock: 12 },
    { id: 4, name: 'Pasta Gigi', stock: 8 },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formName, setFormName] = useState('');
  const [formStock, setFormStock] = useState('');

  // Untuk pencarian dan filter
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStock, setFilterStock] = useState('all'); // all, more10, lessEqual10

  // Buka form tambah
  const openAddForm = () => {
    setEditingItem(null);
    setFormName('');
    setFormStock('');
    setShowForm(true);
  };

  // Buka form edit
  const openEditForm = (item) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormStock(item.stock);
    setShowForm(true);
  };

  // Tutup form
  const closeForm = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormName('');
    setFormStock('');
  };

  // Submit form tambah/edit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formStock) {
      alert('Mohon isi semua field');
      return;
    }
    if (editingItem) {
      setItems(
        items.map((it) =>
          it.id === editingItem.id
            ? { ...it, name: formName, stock: Number(formStock) }
            : it
        )
      );
    } else {
      const newId = items.length ? Math.max(...items.map((i) => i.id)) + 1 : 1;
      setItems([...items, { id: newId, name: formName, stock: Number(formStock) }]);
    }
    closeForm();
  };

  // Hapus item
  const handleDelete = (id) => {
    if (window.confirm('Yakin ingin menghapus data ini?')) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  // Filter dan cari data sebelum tampil
  const filteredItems = items.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());

    let matchFilter = true;
    if (filterStock === 'more10') matchFilter = item.stock > 10;
    else if (filterStock === 'lessEqual10') matchFilter = item.stock <= 10;

    return matchSearch && matchFilter;
  });

  // Fungsi untuk update stok barang, dipanggil saat admin konfirmasi kirim request
  const updateItemStock = (barangId, jumlah) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === barangId ? { ...item, stock: item.stock - jumlah } : item
      )
    );
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-semibold mb-4">Data Barang</h2>

      {/* User admin boleh tambah */}
      {user?.role === 'admin' && (
        <button
          onClick={openAddForm}
          className="mb-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Tambah Barang
        </button>
      )}

      {/* Form tambah/edit */}
      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded shadow">
          <div className="mb-4">
            <label className="block mb-1 font-medium">Nama Barang</label>
            <input
              type="text"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Masukkan nama barang"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-medium">Stok</label>
            <input
              type="number"
              value={formStock}
              onChange={(e) => setFormStock(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Masukkan jumlah stok"
            />
          </div>
          <div className="flex space-x-2">
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={closeForm}
              className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
            >
              Batal
            </button>
          </div>
        </form>
      )}

      {/* Pencarian dan filter */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:space-x-4">
        <input
          type="text"
          placeholder="Cari nama barang..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-2 sm:mb-0 p-2 border border-gray-300 rounded flex-grow"
        />
        <select
          value={filterStock}
          onChange={(e) => setFilterStock(e.target.value)}
          className="p-2 border border-gray-300 rounded"
        >
          <option value="all">Semua Stok</option>
          <option value="more10">Stok &gt; 10</option>
          <option value="lessEqual10">Stok ≤ 10</option>
        </select>
      </div>

      {/* Tabel data */}
      <table className="min-w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="text-left px-6 py-3">ID</th>
            <th className="text-left px-6 py-3">Nama Barang</th>
            <th className="text-left px-6 py-3">Stok</th>
            <th className="text-left px-6 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6">
                Data barang tidak ditemukan.
              </td>
            </tr>
          ) : (
            filteredItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{item.id}</td>
                <td className="px-6 py-4">{item.name}</td>
                <td className="px-6 py-4">{item.stock}</td>
                <td className="px-6 py-4 space-x-2">
                  {user?.role === 'admin' ? (
                    <>
                      <button
                        onClick={() => openEditForm(item)}
                        className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </>
                  ) : (
                    <span className="text-gray-500 italic">Tidak ada aksi</span>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <RequestBarang items={items} updateItemStock={updateItemStock} />
    </div>
  );
};

export default Barang;
