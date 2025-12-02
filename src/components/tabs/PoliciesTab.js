import React from 'react';
import { Grid, Card, CardContent, Typography, FormControlLabel, Switch, TextField } from '@mui/material';

export default function PoliciesTab({ isReadOnly, emergencyMode, setEmergencyMode, busPriority, setBusPriority }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Card sx={{ borderLeft: '5px solid #ff9800' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Emergency Priority (Acil Durum)</Typography>
            <FormControlLabel 
                control={<Switch checked={emergencyMode} onChange={(e) => setEmergencyMode(e.target.checked)} color="warning" disabled={isReadOnly} />} 
                label={emergencyMode ? "Acil Durum Modu AKTİF" : "Acil Durum Modu KAPALI"} 
            />
            <FormControlLabel control={<Switch disabled={isReadOnly}/>} label="Sadece Log Tut" />
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12}>
        <Card sx={{ borderLeft: '5px solid #2196f3' }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>Bus Priority (Otobüs Önceliği)</Typography>
            <FormControlLabel 
                control={<Switch checked={busPriority} onChange={(e) => setBusPriority(e.target.checked)} color="primary" disabled={isReadOnly} />} 
                label={busPriority ? "Otobüs Önceliği AKTİF" : "Otobüs Önceliği KAPALI"} 
            />
            <TextField disabled={isReadOnly} size="small" label="Maksimum Uzatma (sn)" defaultValue="15" sx={{ ml: 2, width: 150 }} />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
