// src/screens/LoginScreen.js
import React from 'react';
import { Box, Button, Typography, Paper, Alert } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import { auth, provider } from '../config/firebase'; 
import { signInWithPopup, signOut } from "firebase/auth";

// --- YETKİLİ KULLANICI LİSTESİ (WHITELIST) ---
// Sadece bu listedeki e-posta adresleri sisteme erişebilir.
const ALLOWED_USERS = [
  "ali_isakoca@hotmail.com",  // Sen
  "akyuzmustafaa@hotmail.com",       // Ekip Arkadaşı 1
  "aliozen210@gmail.com",            // Ekip Arkadaşı 2
  "menes.gurkan@gmail.com",       // Ekip Arkadaşı 3
  "bedirhanyigit71@gmail.com"       // Ekip Arkadaşı 4
];

export default function LoginScreen({ onLogin }) {

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      console.log("Giriş Denemesi:", user.email);

      // --- GÜVENLİK KONTROLÜ ---
      if (ALLOWED_USERS.includes(user.email)) {
        // Kullanıcı listede mevcut, erişim izni veriliyor.
        console.log("Erişim İzni Verildi ✅");
        
        // Tüm yetkili kullanıcılar varsayılan olarak 'admin' yetkisine sahiptir.
        onLogin(user.email, 'admin'); 

      } else {
        // Kullanıcı listede yok, erişim reddediliyor.
        console.warn("Yetkisiz Giriş Denemesi 🚫");
        alert("ERİŞİM ENGELLENDİ!\nBu mail adresi proje ekibinde tanımlı değil.");
        
        // Hemen oturumu kapat (Kick out)
        await signOut(auth);
      }

    } catch (error) {
      console.error("Giriş Hatası:", error);
      alert("Giriş yapılamadı: " + error.message);
    }
  };

  return (
    <Box 
      sx={{ 
        height: '100vh', width: '100vw',
        backgroundImage: 'url(https://source.unsplash.com/random/1920x1080/?city,traffic)', // Rastgele havalı trafik resmi
        backgroundSize: 'cover', backgroundPosition: 'center',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}
    >
      <Paper 
        elevation={24}
        sx={{ 
          p: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', 
          backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)',
          borderRadius: '20px', maxWidth: '400px'
        }}
      >
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 1, color: '#1a237e' }}>
          TrafficOS
        </Typography>
        <Typography variant="body2" sx={{ mb: 4, color: '#555' }}>
          Akıllı Kavşak Yönetim Paneli
        </Typography>
        
        <Button 
          variant="contained" 
          size="large"
          startIcon={<GoogleIcon />}
          onClick={handleGoogleLogin}
          sx={{ 
            bgcolor: '#db4437', color: 'white', py: 1.5, px: 4, fontWeight: 'bold',
            '&:hover': { bgcolor: '#c53929' }
          }}
        >
          Google ile Giriş Yap
        </Button>

        <Typography variant="caption" sx={{ mt: 3, color: '#777' }}>
          Sadece yetkili personel giriş yapabilir.
        </Typography>
      </Paper>
    </Box>
  );
}
