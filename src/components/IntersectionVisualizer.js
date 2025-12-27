

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';


// Basit Trafik Işığı Bileşeni
const TrafficLight = ({ color, label, position }) => (
  <Box sx={{ 
    display: 'flex', flexDirection: 'column', alignItems: 'center', 
    position: 'absolute', ...position, zIndex: 10
  }}>
    <Box sx={{ 
      width: 20, height: 60, bgcolor: '#333', borderRadius: 2, p: 0.5,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    }}>
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color === 'red' ? '#ff1744' : '#550000', boxShadow: color==='red'?'0 0 10px #ff1744':'none' }} />
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color === 'yellow' ? '#ffea00' : '#554400', boxShadow: color==='yellow'?'0 0 10px #ffea00':'none' }} />
      <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: color === 'green' ? '#00e676' : '#003300', boxShadow: color==='green'?'0 0 10px #00e676':'none' }} />
    </Box>
    <Typography variant="caption" sx={{ mt: 0.5, fontWeight: 'bold', color: '#555' }}>{label}</Typography>
  </Box>
);

export default function IntersectionVisualizer({ activePhase, phases, emergencyMode, failsafeMode, intersectionType, controlMode }) {
  const [currentPhase, setCurrentPhase] = useState(phases?.[0]);
  const [phaseProgress, setPhaseProgress] = useState(0);

  
  // Simülasyon için state (Fixed Time ve Adaptive AI için döngü)
  const [cycleState, setCycleState] = useState(0); // 0: NS Green, 1: NS Yellow, 2: EW Green, 3: EW Yellow

  useEffect(() => {
    if (!phases || phases.length === 0) return;
    if (emergencyMode) return;
    if (controlMode === 'adaptive-ai') return;

    let index = 0;
    setCurrentPhase(phases[index]);
    setPhaseProgress(0);

    const tick = setInterval(() => {
      setPhaseProgress(prev => {
        if (prev >= 100) {
          index = (index + 1) % phases.length;
          setCurrentPhase(phases[index]);
          return 0;
        }
        return prev + (100 / phases[index].duration);
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [phases, emergencyMode, controlMode]);

  useEffect(() => {
    if (controlMode !== 'adaptive-ai') return;

    const interval = setInterval(() => {
      // NS %60 ihtimalle yeşil alsın
      const random = Math.random();
      setCycleState(random > 0.4 ? 0 : 2);
    }, 2500);

    return () => clearInterval(interval);
  }, [controlMode]);

  // Işık Rengini Belirle
  const getLightColor = (direction) => {
    // 1. ACİL DURUM (En yüksek öncelik)
    if (emergencyMode) return 'red';

    // 2. FAILSAFE MODLARI
    if (failsafeMode === 'flash-yellow') return 'yellow';
    if (failsafeMode === 'all-red') return 'red';

    // 3. NORMAL OPERASYON (Fixed Time / Adaptive AI)
    // Basit bir döngü simülasyonu
    if (!activePhase) return 'red';

if (direction === 'NS') {
  return activePhase.shortName.includes('NS') ? 'green' : 'red';
}

if (direction === 'EW') {
  return activePhase.shortName.includes('EW') ? 'green' : 'red';
}
  };

  const nsColor = getLightColor('NS');
  const ewColor = getLightColor('EW');

  // Kavşak Tipi Çizimi
  const renderRoads = () => {
    const roadColor = '#555';
    const roadWidth = '80px';

    switch (intersectionType) {
      case 't-junction':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: roadWidth, height: '50%', bgcolor: roadColor, transform: 'translateX(-50%)' }} />
          </>
        );
      case 'roundabout':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            <Box sx={{ position: 'absolute', top: 0, left: '50%', width: roadWidth, height: '100%', bgcolor: roadColor, transform: 'translateX(-50%)' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '120px', height: '120px', bgcolor: roadColor, borderRadius: '50%', transform: 'translate(-50%, -50%)', border: '2px dashed #fff' }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '60px', height: '60px', bgcolor: '#4caf50', borderRadius: '50%', transform: 'translate(-50%, -50%)', border: '4px solid #fff' }} />
          </>
        );
      case 'pedestrian-crossing':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            {/* Zebra Çizgileri */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '60px', height: roadWidth, transform: 'translate(-50%, -50%)', 
              backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #fff 10px, #fff 20px)' 
            }} />
          </>
        );
      case 'pedestrian-overpass':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            {/* Üst Geçit Gövdesi */}
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '40px', height: '100%', bgcolor: '#90a4ae', transform: 'translate(-50%, -50%)', boxShadow: 3, zIndex: 5 }} />
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', width: '30px', height: '100%', bgcolor: '#cfd8dc', transform: 'translate(-50%, -50%)', zIndex: 6 }} />
          </>
        );
      case 'tram-crossing':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            {/* Raylar */}
            <Box sx={{ position: 'absolute', top: 0, left: '50%', width: '40px', height: '100%', transform: 'translateX(-50%)', borderLeft: '4px solid #3e2723', borderRight: '4px solid #3e2723' }} />
            <Box sx={{ position: 'absolute', top: 0, left: '50%', width: '40px', height: '100%', transform: 'translateX(-50%)', 
               backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 15px, #5d4037 15px, #5d4037 20px)' 
            }} />
          </>
        );
      case 'metro-station':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            {/* Metro Girişi */}
            <Box sx={{ position: 'absolute', top: '20%', left: '50%', width: '60px', height: '40px', bgcolor: '#d32f2f', borderRadius: 1, transform: 'translateX(-50%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', border:'2px solid white' }}>M</Box>
            <Box sx={{ position: 'absolute', bottom: '20%', left: '50%', width: '60px', height: '40px', bgcolor: '#d32f2f', borderRadius: 1, transform: 'translateX(-50%)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:'bold', border:'2px solid white' }}>M</Box>
          </>
        );
      case 'tunnel-entrance':
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            {/* Tünel Ağzı */}
            <Box sx={{ position: 'absolute', top: '50%', right: '10%', width: '40px', height: '100px', bgcolor: '#000', borderRadius: '20px 0 0 20px', transform: 'translateY(-50%)', border: '4px solid #757575' }} />
            <Typography sx={{ position: 'absolute', top: '50%', right: '12%', color: 'white', transform: 'translateY(-50%)', zIndex: 2, fontWeight:'bold' }}>TUNNEL</Typography>
          </>
        );
      case 'highway-merge':
        return (
          <>
             {/* Ana Yol */}
             <Box sx={{ position: 'absolute', top: '60%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
             {/* Katılım Yolu (Açılı) */}
             <Box sx={{ position: 'absolute', top: '20%', left: '0%', width: '60%', height: roadWidth, bgcolor: roadColor, transform: 'rotate(20deg)', transformOrigin: 'left center' }} />
          </>
        );
      default: // 4-way
        return (
          <>
            <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: roadWidth, bgcolor: roadColor, transform: 'translateY(-50%)' }} />
            <Box sx={{ position: 'absolute', top: 0, left: '50%', width: roadWidth, height: '100%', bgcolor: roadColor, transform: 'translateX(-50%)' }} />
          </>
        );
    }
  };

  return (
    <Box sx={{ 
      width: '100%', height: '300px', bgcolor: '#e0e0e0', borderRadius: 4, 
      position: 'relative', overflow: 'hidden', border: '4px solid #bdbdbd'
    }}><Box sx={{
  position: 'absolute',
  bottom: 10,
  left: '50%',
  transform: 'translateX(-50%)',
  bgcolor: activePhase.color,
  color: 'white',
  px: 2,
  py: 0.5,
  borderRadius: 2,
  fontWeight: 'bold',
  boxShadow: '0 0 15px rgba(0,0,0,0.4)'
}}>
  <Box sx={{
  position: 'absolute',
  bottom: 0,
  left: 0,
  height: '6px',
  width: `${phaseProgress}%`,
  bgcolor: activePhase.color,
  transition: 'width 0.8s linear'
}} />
  ACTIVE PHASE: {activePhase.name}
</Box>
      {/* 🚨 EMERGENCY MODE GÖRSEL UYARI */}
    {emergencyMode && (
      <Box sx={{
        position: 'absolute',
        top: 10,
        right: 10,
        bgcolor: 'error.main',
        color: 'white',
        px: 2,
        py: 0.5,
        borderRadius: 2,
        fontWeight: 'bold',
        zIndex: 20,
        boxShadow: '0 0 10px rgba(255,0,0,0.8)',
        animation: 'pulse 1.2s infinite'
      }}>
        🚨 EMERGENCY MODE
      </Box>
      
    )}
      {renderRoads()}
      
      {/* ŞERİT ÇİZGİLERİ (Basitleştirilmiş) */}
      <Box sx={{ position: 'absolute', top: '50%', left: 0, width: '100%', height: '2px', bgcolor: 'transparent', transform: 'translateY(-50%)', borderTop: '2px dashed #fff', opacity: 0.5 }} />
      <Box sx={{ position: 'absolute', top: 0, left: '50%', width: '2px', height: '100%', bgcolor: 'transparent', transform: 'translateX(-50%)', borderLeft: '2px dashed #fff', opacity: 0.5 }} />

      {/* TRAFİK IŞIKLARI */}
      {/* Kuzey (N) - Her zaman var */}
      <TrafficLight color={nsColor} label="N" position={{ top: '20px', left: '55%' }} />
      
      {/* Güney (S) - T Kavşakta olmayabilir ama genelde olur, biz koyalım */}
      <TrafficLight color={nsColor} label="S" position={{ bottom: '20px', right: '55%' }} />
      
      {/* Doğu (E) - Her zaman var */}
      <TrafficLight color={ewColor} label="E" position={{ right: '20px', top: '35%' }} />
      
      {/* Batı (W) - Her zaman var */}
      <TrafficLight color={ewColor} label="W" position={{ left: '20px', bottom: '35%' }} />

      {/* Kavşak Tipi Etiketi */}
      <Box sx={{ position: 'absolute', top: 10, left: 10, bgcolor: 'rgba(255,255,255,0.8)', p: 0.5, borderRadius: 1 }}>
        <Typography variant="caption" fontWeight="bold">{intersectionType?.toUpperCase() || '4-WAY'}</Typography>
      </Box>
    </Box>
  );
}
