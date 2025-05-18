import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Simulasi daftar user yang terdaftar
  const [users, setUsers] = useState([
    { email: 'admin@example.com', password: 'admin123', role: 'admin' },
    { email: 'user@example.com', password: 'user123', role: 'user' },
  ]);

  const [user, setUser] = useState(null);

  // Fungsi register user baru
  const register = (newUser) => {
    // Cek email sudah ada atau belum
    const exists = users.find((u) => u.email === newUser.email);
    if (exists) {
      return { success: false, message: 'Email sudah terdaftar' };
    }
    setUsers([...users, newUser]);
    return { success: true };
  };

  // Fungsi login user, return success/fail
  const login = ({ email, password }) => {
    const matchedUser = users.find(
      (u) => u.email === email && u.password === password
    );
    if (matchedUser) {
      setUser(matchedUser);
      return { success: true };
    }
    return { success: false, message: 'Email atau password salah' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, users, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
