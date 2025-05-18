import React, { createContext, useState, useContext } from 'react';

const RequestContext = createContext();

export const RequestProvider = ({ children }) => {
  // Simulasi data request
  // Format request: {id, userEmail, barangId, barangName, quantity, status}
  const [requests, setRequests] = useState([]);

  // Tambah request baru
  const addRequest = (request) => {
    const newId = requests.length ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    setRequests([...requests, { id: newId, ...request }]);
  };

  // Update status request
  const updateRequestStatus = (id, newStatus) => {
    setRequests(
      requests.map(r => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Hapus request (misal batal oleh user)
  const deleteRequest = (id) => {
    setRequests(requests.filter(r => r.id !== id));
  };

  return (
    <RequestContext.Provider value={{ requests, addRequest, updateRequestStatus, deleteRequest }}>
      {children}
    </RequestContext.Provider>
  );
};

export const useRequest = () => useContext(RequestContext);
