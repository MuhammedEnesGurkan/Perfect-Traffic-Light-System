// src/screens/DashboardScreen.js
import React, { useState } from 'react';
import { 
  Container, Box, Button, Typography, Paper, AppBar, Toolbar, IconButton, Tabs, Tab, 
  Snackbar, Alert, Chip, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Card, CardContent,
  Grid // <--- EKSİK OLAN BUYDU, EKLENDİ.
} from '@mui/material';
import { 
  Menu as MenuIcon, Logout as LogoutIcon, Save as SaveIcon, Traffic as TrafficIcon,
  Settings as SettingsIcon, Policy as PolicyIcon, Map as MapIcon, Security as SecurityIcon, 
  Visibility as VisibilityIcon, Info as InfoIcon, History as HistoryIcon, Restore as RestoreIcon
} from '@mui/icons-material';

import TabPanel from '../components/TabPanel';
import GeneralSettingsTab from '../components/tabs/GeneralSettingsTab';
import LanesTab from '../components/tabs/LanesTab';
import PoliciesTab from '../components/tabs/PoliciesTab';
import SecurityTab from '../components/tabs/SecurityTab';
import { initialLanes } from '../data/laneData';

export default function DashboardScreen({ userRole, onLogout }) {
  const [tabValue, setTabValue] = useState(0);
  const [notification, setNotification] = useState({ open: false, message: '' });

  // --- MERKEZİ STATE YÖNETİMİ ---
  const [emergencyMode, setEmergencyMode] = useState(true);
  const [busPriority, setBusPriority] = useState(true);
  const [failsafeMode, setFailsafeMode] = useState('flash-yellow');
  const [simulationSpeed, setSimulationSpeed] = useState(1);
  const [controlMode, setControlMode] = useState('adaptive-ai'); 
  const [intersectionType, setIntersectionType] = useState('4-way');
  const [controllerIp, setControllerIp] = useState('192.168.1.50');

  const isReadOnly = userRole === 'viewer';

  const handleSave = () => {
    if (isReadOnly) return;
    setNotification({ open: true, message: 'Tüm konfigürasyon başarıyla güncellendi!' });
  };

  const getConfigJSON = () => {
    return JSON.stringify({
      id: "JN-01", role: userRole, type: intersectionType,
      mode: controlMode.toUpperCase(),
      policies: { emergency: emergencyMode, busPriority: busPriority }
    }, null, 2);
  };

  const handleDownloadConfig = () => {
    const configData = {
      intersectionId: "JN-01",
      role: userRole,
      type: intersectionType,
      network: { ip: controllerIp, port: 8080, status: "online" },
      controlStrategy: controlMode.toUpperCase(),
      lanes: initialLanes.map(l => l.label),
      policies: { emergency: emergencyMode, busPriority: busPriority, failsafe: failsafeMode },
      simulationSpeed: simulationSpeed,
      version: "v1.4.2"
    };

    const jsonString = JSON.stringify(configData, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href; link.download = "traffic_config_jn01.json";
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
    setNotification({ open: true, message: 'Konfigürasyon dosyası (JSON) İndirildi!' });
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: '#f4f6f8', paddingBottom: '80px' }}>
      <AppBar position="static" sx={{ bgcolor: isReadOnly ? '#455a64' : '#1a237e' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" sx={{ mr: 2 }}><MenuIcon /></IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>Perfect Traffic - {isReadOnly ? 'Viewer' : 'Admin'}</Typography>
          <Button color="inherit" onClick={onLogout} startIcon={<LogoutIcon />}>Çıkış</Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {/* INFO HEADER */}
        <Paper elevation={2} sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: isReadOnly ? '6px solid #9e9e9e' : '6px solid #1a237e' }}>
           <Box display="flex" alignItems="center">
              <Box sx={{ p: 1.5, borderRadius: '50%', bgcolor: '#e3f2fd', color: '#1565c0', display:'flex' }}>
                 {isReadOnly ? <VisibilityIcon fontSize="large"/> : <TrafficIcon fontSize="large" />}
              </Box>
              <Box ml={2}>
                <Typography variant="h5" fontWeight="bold">Kavşak Konfigürasyonu</Typography>
                <Typography variant="body2" color="text.secondary">Giriş: <b>{userRole.toUpperCase()}</b> | Durum: <span style={{color: 'green'}}>AKTİF</span></Typography>
              </Box>
           </Box>
           <Button variant="contained" color={isReadOnly ? "inherit" : "primary"} startIcon={<SaveIcon />} onClick={handleSave} disabled={isReadOnly} sx={{ opacity: isReadOnly ? 0.6 : 1 }}>
              {isReadOnly ? "Salt Okunur" : "Kaydet"}
           </Button>
        </Paper>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'white' }}>
          <Tabs value={tabValue} onChange={(e, n) => setTabValue(n)} centered>
            <Tab icon={<SettingsIcon />} label="Genel" />
            <Tab icon={<MapIcon />} label="Şeritler" />
            <Tab icon={<PolicyIcon />} label="Kurallar" />
            <Tab icon={<SecurityIcon />} label="Güvenlik" />
          </Tabs>
        </Box>

        {/* --- MODÜLER SEKME YAPISI --- */}
        <TabPanel value={tabValue} index={0}>
            <GeneralSettingsTab 
                isReadOnly={isReadOnly}
                intersectionType={intersectionType} setIntersectionType={setIntersectionType}
                controllerIp={controllerIp} setControllerIp={setControllerIp}
                controlMode={controlMode} setControlMode={setControlMode}
                onDownload={handleDownloadConfig} configJSON={getConfigJSON()}
            />
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
            <LanesTab isReadOnly={isReadOnly} />
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
            <PoliciesTab 
                isReadOnly={isReadOnly}
                emergencyMode={emergencyMode} setEmergencyMode={setEmergencyMode}
                busPriority={busPriority} setBusPriority={setBusPriority}
            />
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
            <SecurityTab 
                isReadOnly={isReadOnly}
                failsafeMode={failsafeMode} setFailsafeMode={setFailsafeMode}
                simulationSpeed={simulationSpeed} setSimulationSpeed={setSimulationSpeed}
            />
        </TabPanel>

        {/* VERSİYON GEÇMİŞİ TABLOSU */}
        <Grid item xs={12} sx={{mt: 3}}>
          <Card>
              <CardContent>
              <Box display="flex" alignItems="center" mb={1}><HistoryIcon color="action" sx={{mr:1}}/><Typography variant="h6">Geçmiş</Typography></Box>
              <TableContainer>
                  <Table size="small">
                      <TableHead><TableRow><TableCell>Tarih</TableCell><TableCell>Kullanıcı</TableCell><TableCell>İşlem</TableCell></TableRow></TableHead>
                      <TableBody>
                          <TableRow><TableCell>29.11 14:30</TableCell><TableCell>admin</TableCell><TableCell><Button size="small" startIcon={<RestoreIcon/>} color="warning" disabled={isReadOnly}>Geri Al</Button></TableCell></TableRow>
                      </TableBody>
                  </Table>
              </TableContainer>
              </CardContent>
          </Card>
        </Grid>
      </Container>
      
      {/* FOOTER STATUS BAR */}
      <Paper elevation={10} sx={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '50px', bgcolor: '#263238', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-around', borderTop: `3px solid ${isReadOnly ? '#9e9e9e' : '#ff9800'}`, opacity: 1, zIndex: 1000 }}>
          <Box display="flex" alignItems="center"><InfoIcon sx={{ fontSize: 20, mr: 1, color: '#4fc3f7' }} /><Typography variant="body2" fontWeight="bold">Sistem:</Typography></Box>
          <Chip label={emergencyMode ? "🚑 ACİL: ON" : "ACİL: OFF"} color={emergencyMode ? "error" : "default"} size="small" variant="filled" />
          <Chip label={controlMode === 'adaptive-ai' ? "🧠 AI" : "⚙️ MANUEL"} color="info" size="small" variant="filled" />
           <Typography variant="caption" sx={{color: '#bdbdbd'}}>IP: {controllerIp}</Typography>
      </Paper>
      
      <Snackbar open={notification.open} autoHideDuration={4000} onClose={() => setNotification({...notification, open:false})} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
        <Alert onClose={() => setNotification({...notification, open:false})} severity={isReadOnly ? 'info' : 'success'} sx={{ width: '100%' }}>{notification.message}</Alert>
      </Snackbar>
    </Box>
  );
}