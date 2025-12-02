import React from 'react';
import { Grid, Card, CardHeader, CardContent, Divider, TextField, FormControl, InputLabel, Select, MenuItem, Chip, Typography, Button } from '@mui/material';
import { Map as MapIcon, Router as RouterIcon, Tune as TuneIcon, Download as DownloadIcon } from '@mui/icons-material';
import { RadioGroup, FormControlLabel, Radio } from '@mui/material';

export default function GeneralSettingsTab({ 
  isReadOnly, intersectionType, setIntersectionType, 
  controllerIp, setControllerIp, controlMode, setControlMode, 
  onDownload, configJSON 
}) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{mb: 3}}>
          <CardHeader title="Lokasyon & Kimlik" subheader="Fiziksel Konum Bilgileri" avatar={<MapIcon color="primary"/>} />
          <Divider />
          <CardContent>
            <TextField disabled={isReadOnly} fullWidth label="Kavşak Adı" margin="dense" size="small" defaultValue="Beşevler Meydan" />
            <TextField disabled={isReadOnly} fullWidth label="Koordinat" margin="dense" size="small" defaultValue="39.9355, 32.8597" />
            <FormControl fullWidth margin="dense" size="small" disabled={isReadOnly}>
                <InputLabel>Kavşak Tipi (Topology)</InputLabel>
                <Select value={intersectionType} label="Kavşak Tipi (Topology)" onChange={(e) => setIntersectionType(e.target.value)}>
                    <MenuItem value="4-way">4 Kollu Kavşak (Standart)</MenuItem>
                    <MenuItem value="t-junction">T-Kavşak</MenuItem>
                    <MenuItem value="roundabout">Döner Kavşak (Roundabout)</MenuItem>
                </Select>
            </FormControl>
          </CardContent>
        </Card>
        <Card>
          <CardHeader title="Donanım & Ağ Bağlantısı" subheader="Controller Box Settings" avatar={<RouterIcon color="primary"/>} />
          <Divider />
          <CardContent>
            <Grid container spacing={2}>
                <Grid item xs={8}><TextField disabled={isReadOnly} fullWidth label="Controller IP Adresi" size="small" value={controllerIp} onChange={(e) => setControllerIp(e.target.value)} /></Grid>
                <Grid item xs={4}><TextField disabled={isReadOnly} fullWidth label="Port" size="small" defaultValue="8080" /></Grid>
                <Grid item xs={12}><Chip label="BAĞLANTI: ONLİNE" color="success" size="small" variant="outlined" sx={{width: '100%'}}/></Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6}>
         <Card sx={{ mb: 3 }}>
            <CardHeader title="Operasyon Modu" subheader="Sinyal Kontrol Stratejisi" avatar={<TuneIcon color="secondary"/>} />
            <Divider />
            <CardContent>
                <FormControl component="fieldset" disabled={isReadOnly}>
                    <RadioGroup value={controlMode} onChange={(e) => setControlMode(e.target.value)}>
                        <FormControlLabel value="adaptive-ai" control={<Radio />} label="Adaptive AI (Akıllı Mod)" />
                        <Typography variant="caption" color="text.secondary" sx={{ml: 4, mb: 1, display:'block'}}>Sensör verisine göre süreleri optimize eder.</Typography>
                        <FormControlLabel value="fixed-time" control={<Radio />} label="Fixed Time (Sabit Süreli)" />
                        <FormControlLabel value="manual" control={<Radio />} label="Manuel Override" />
                    </RadioGroup>
                </FormControl>
            </CardContent>
         </Card>
         <Card sx={{ bgcolor: '#212121', color: '#fff' }}>
          <CardHeader 
            title={<Typography variant="h6" sx={{color: '#64ffda', fontFamily: 'monospace'}}>Configuration Schema</Typography>}
            action={<Button variant="outlined" size="small" startIcon={<DownloadIcon />} onClick={onDownload} sx={{ color: '#64ffda', borderColor: 'rgba(100, 255, 218, 0.5)', '&:hover': { borderColor: '#64ffda', bgcolor: 'rgba(100, 255, 218, 0.1)' }}}>İNDİR (.JSON)</Button>}
          />
          <Divider sx={{bgcolor: '#424242'}} />
          <CardContent>
            <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '12px', whiteSpace: 'pre-wrap', color: '#e0e0e0' }}>
              {configJSON}
            </Typography>
          </CardContent>
         </Card>
      </Grid>
    </Grid>
  );
}