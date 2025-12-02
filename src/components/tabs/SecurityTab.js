import React from 'react';
import { Grid, Card, CardContent, Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, TextField, Divider, Switch } from '@mui/material';
import { WarningAmber as WarningAmberIcon } from '@mui/icons-material';

export default function SecurityTab({ isReadOnly, failsafeMode, setFailsafeMode, simulationSpeed, setSimulationSpeed }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <WarningAmberIcon color="error" sx={{ mr: 1 }} />
              <Typography variant="h6">Fail-Safe (Hata) Modu</Typography>
            </Box>
            <FormControl disabled={isReadOnly}>
              <FormLabel id="failsafe-group">Varsayılan Davranış</FormLabel>
              <RadioGroup value={failsafeMode} onChange={(e) => setFailsafeMode(e.target.value)} name="failsafe-group">
                <FormControlLabel value="all-red" control={<Radio />} label="Tüm Yönler Kırmızı" />
                <FormControlLabel value="flash-yellow" control={<Radio />} label="Kontrollü Sarı Flaş" />
                <FormControlLabel value="fixed-time" control={<Radio />} label="Sabit Süreli Plan" />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Simülasyon Ayarları</Typography>
            <Box sx={{ width: '100%', px: 1, py: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <TextField
                    label="Simülasyon Hızı (x)" type="number" value={simulationSpeed} disabled={isReadOnly}
                    onChange={(e) => { let val = Number(e.target.value); if (val < 1) val = 1; if (val > 10) val = 10; setSimulationSpeed(val); }}
                    InputProps={{ inputProps: { min: 1, max: 10 } }} variant="outlined" size="small" sx={{ width: '150px', mb: 1 }}
                />
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>(1x = Gerçek Zaman, 10x = Çok Hızlı)</Typography>
            </Box>
            <Divider sx={{ my: 3 }} />
            <FormControlLabel control={<Switch defaultChecked disabled={isReadOnly}/>} label="Sentetik Trafik Üret" />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
