import React, { useState } from 'react';
import { Grid, Card, CardHeader, CardContent, Typography, FormControlLabel, Switch, TextField, Divider, Box, Slider, Chip, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { 
  LocalPolice as PoliceIcon, 
  DirectionsBus as BusIcon, 
  AccessTime as TimeIcon, 
  NaturePeople as EcoIcon, 
  PedalBike as BikeIcon,
  Warning as WarningIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';

export default function PoliciesTab({ 
  isReadOnly, 
  emergencyMode, setEmergencyMode, 
  busPriority, setBusPriority,
  rushHourMode, setRushHourMode,
  ecoMode, setEcoMode,
  pedestrianLPI, setPedestrianLPI,
  enforcementLevel, setEnforcementLevel
}) {
  // Yerel State'ler KALDIRILDI (Artık Props'tan geliyor)

  return (
    <Grid container spacing={3}>
      
      {/* 1. ÖNCELİK YÖNETİMİ (PRIORITY MANAGEMENT) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', borderLeft: '6px solid #ff9800' }}>
          <CardHeader 
            avatar={<PoliceIcon color="warning" fontSize="large"/>}
            title="Öncelik Yönetimi" 
            subheader="Acil Durum ve VIP Protokolleri"
          />
          <Divider />
          <CardContent>
            <Box sx={{ mb: 3, p: 2, bgcolor: '#fff3e0', borderRadius: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>🚑 Acil Durum (EVP)</Typography>
              <FormControlLabel 
                  control={<Switch checked={emergencyMode} onChange={(e) => setEmergencyMode(e.target.checked)} color="error" disabled={isReadOnly} />} 
                  label={emergencyMode ? <Chip label="AKTİF: Tüm Işıklar Kırmızı" color="error" size="small"/> : "Pasif"} 
              />
              <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                Ambulans/İtfaiye yaklaştığında kavşağı boşaltır.
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>🚌 Toplu Taşıma Önceliği (TSP)</Typography>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <FormControlLabel 
                    control={<Switch checked={busPriority} onChange={(e) => setBusPriority(e.target.checked)} color="primary" disabled={isReadOnly} />} 
                    label="Otobüs/Tramvay Önceliği" 
                />
                <Chip label={busPriority ? "High Priority" : "Low Priority"} variant="outlined" size="small" color={busPriority ? "primary" : "default"} />
              </Box>
              <Box sx={{ mt: 2, px: 1 }}>
                <Typography variant="caption">Maksimum Yeşil Uzatma (sn)</Typography>
                <Slider 
                  defaultValue={15} step={5} min={5} max={60} valueLabelDisplay="auto" 
                  disabled={!busPriority || isReadOnly} 
                />
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* 2. ZAMAN VE ÇEVRE (TIME & ECO) */}
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%', borderLeft: '6px solid #4caf50' }}>
          <CardHeader 
            avatar={<EcoIcon color="success" fontSize="large"/>}
            title="Çevre ve Zaman Kuralları" 
            subheader="Sürdürülebilir Trafik Yönetimi"
          />
          <Divider />
          <CardContent>
            
            {/* Rush Hour */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center">
                <TimeIcon color="action" sx={{ mr: 1 }} />
                <Box>
                  <Typography variant="subtitle2">Zirve Saat Modu (Rush Hour)</Typography>
                  <Typography variant="caption" color="text.secondary">07:00-09:00 & 17:00-19:00</Typography>
                </Box>
              </Box>
              <Switch checked={rushHourMode} onChange={(e) => setRushHourMode(e.target.checked)} disabled={isReadOnly} />
            </Box>

            {/* Eco Mode */}
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
              <Box display="flex" alignItems="center">
                <NaturePeopleIconWrapper />
                <Box>
                  <Typography variant="subtitle2">Hava Kalitesi Kontrolü</Typography>
                  <Typography variant="caption" color="text.secondary">Kirlilik artarsa dur-kalkı azalt.</Typography>
                </Box>
              </Box>
              <Switch checked={ecoMode} onChange={(e) => setEcoMode(e.target.checked)} color="success" disabled={isReadOnly} />
            </Box>

            <Divider sx={{ my: 2 }} />

            {/* Yaya & Bisiklet */}
            <Typography variant="subtitle2" gutterBottom><BikeIcon fontSize="small" sx={{verticalAlign:'middle', mr:1}}/> Yaya ve Bisiklet Dostu</Typography>
            <Box sx={{ px: 1 }}>
               <Typography variant="caption">Yaya Erken Başlangıç (LPI) - {pedestrianLPI} sn</Typography>
               <Slider 
                 value={pedestrianLPI} onChange={(e, v) => setPedestrianLPI(v)} 
                 min={0} max={10} step={1} marks 
                 disabled={isReadOnly}
                 size="small"
               />
               <FormControlLabel control={<Switch disabled={isReadOnly}/>} label="Bisiklet Yeşil Dalga (Green Wave)" />
            </Box>

          </CardContent>
        </Card>
      </Grid>

      {/* 3. DENETİM (ENFORCEMENT) */}
      <Grid item xs={12}>
        <Card sx={{ borderLeft: '6px solid #d32f2f' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SpeedIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Denetim ve Ceza Sistemleri (EDS)</Typography>
            </Box>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small" disabled={isReadOnly}>
                  <InputLabel>Denetim Seviyesi</InputLabel>
                  <Select value={enforcementLevel} label="Denetim Seviyesi" onChange={(e) => setEnforcementLevel(e.target.value)}>
                    <MenuItem value="strict">Sıkı (Strict) - 0 Tolerans</MenuItem>
                    <MenuItem value="moderate">Orta (Moderate) - %10 Tolerans</MenuItem>
                    <MenuItem value="relaxed">Esnek (Relaxed)</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={8}>
                <Box display="flex" gap={2}>
                  <FormControlLabel control={<Switch defaultChecked disabled={isReadOnly} color="error"/>} label="Kırmızı Işık Kamerası" />
                  <FormControlLabel control={<Switch defaultChecked disabled={isReadOnly} color="error"/>} label="Hız Koridoru" />
                  <FormControlLabel control={<Switch disabled={isReadOnly}/>} label="Emniyet Şeridi İhlal" />
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

    </Grid>
  );
}

// İkon Wrapper (MUI icon import hatasını önlemek için basit bir çözüm)
const NaturePeopleIconWrapper = () => <EcoIcon color="success" sx={{ mr: 1 }} />;

