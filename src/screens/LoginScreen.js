// src/screens/LoginScreen.js
import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Paper, InputAdornment } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <Box 
      sx={{ 
        height: '100vh', width: '100vw',
        backgroundImage: 'url(/arka_plan.jpg)', 
        backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'fixed', top: 0, left: 0
      }}
    >
      <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }} />
      <Paper 
        elevation={24}
        sx={{ 
          p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
          width: '90%', maxWidth: '450px',
          backgroundColor: 'rgba(30, 30, 30, 0.70)', backdropFilter: 'blur(12px)',
          borderRadius: '20px', border: '1px solid rgba(255, 255, 255, 0.1)', 
          zIndex: 2, boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)'
        }}
      >
        <Typography component="h1" variant="h4" sx={{ color: '#fff', fontWeight: '900', textAlign: 'center', mb: 4, textShadow: '0px 0px 15px rgba(255,255,255,0.3)' }}>
          PERFECT TRAFFIC<br/><span style={{ fontSize: '0.7em', fontWeight: '300', color: '#64ffda' }}>SIMULATION</span>
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <TextField
            margin="normal" required fullWidth placeholder="Kullanıcı Adı" variant="outlined"
            value={username} onChange={(e) => setUsername(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><PersonIcon sx={{ color: '#64ffda' }} /></InputAdornment>), style: { color: 'white' } }}
            sx={{ '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: '#64ffda' }, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' } }}
          />
          <TextField
            margin="normal" required fullWidth type="password" placeholder="Şifre" variant="outlined"
            value={password} onChange={(e) => setPassword(e.target.value)}
            InputProps={{ startAdornment: (<InputAdornment position="start"><LockIcon sx={{ color: '#64ffda' }} /></InputAdornment>), style: { color: 'white' } }}
            sx={{ mb: 4, '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'rgba(255,255,255,0.2)' }, '&.Mui-focused fieldset': { borderColor: '#64ffda' }, backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px' } }}
          />
          <Button 
            type="submit" fullWidth variant="contained" size="large" endIcon={<ArrowForwardIcon />}
            sx={{ mt: 1, mb: 2, py: 1.8, fontSize: '1rem', fontWeight: 'bold', borderRadius: '12px', backgroundColor: '#00e676', color: '#000', '&:hover': { backgroundColor: '#00c853' } }}
          >
            SİMÜLASYONU BAŞLAT
          </Button>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', mt: 2, display: 'block', textAlign: 'center' }}>
            Demo: admin/admin veya viewer/viewer
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}
