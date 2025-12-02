// src/App.js
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('admin'); // 'admin' veya 'viewer'

  const handleLogin = (username, password) => {
    if (username === 'admin' && password === 'admin') {
      setUserRole('admin');
      setIsLoggedIn(true);
    } else if (username === 'viewer' && password === 'viewer') {
      setUserRole('viewer');
      setIsLoggedIn(true);
    } else {
      alert("Hatalı Giriş!\nAdmin için: admin / admin\nİzleyici için: viewer / viewer");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  // KULLANICI GİRİŞ YAPTIYSA DASHBOARD'I GÖSTER, YOKSA LOGIN EKRANINI GÖSTER
  return (
    <>
      {isLoggedIn ? (
        <DashboardScreen userRole={userRole} onLogout={handleLogout} />
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </>
  );
}

export default App;
