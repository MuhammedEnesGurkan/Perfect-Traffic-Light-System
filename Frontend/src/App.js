// src/App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './config/theme';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import TrafficSimulationContainer from './components/TrafficSimulationContainer';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('admin'); // 'admin' veya 'viewer'

  const handleLogin = (email, role) => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('');
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          {/* Public Route: Simulation Demo */}
          <Route path="/simulation" element={<TrafficSimulationContainer />} />

          {/* Main App Routes */}
          <Route
            path="/"
            element={
              isLoggedIn
                ? <DashboardScreen userRole={userRole} onLogout={handleLogout} />
                : <LoginScreen onLogin={handleLogin} />
            }
          />

          {/* Redirect any unknown route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
