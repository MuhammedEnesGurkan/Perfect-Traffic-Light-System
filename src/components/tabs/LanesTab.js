import React from 'react';
import { Grid, Card, CardContent, Box, Typography, Button, Divider, List, ListItem, ListItemIcon, ListItemText, Chip, Alert, TextField } from '@mui/material';
import { AddCircle as AddCircleIcon } from '@mui/icons-material';
import { initialLanes } from '../../data/laneData'; // Veriyi buradan çekiyoruz

export default function LanesTab({ isReadOnly }) {
  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>Tüm yönler için (Kuzey, Güney, Doğu, Batı) Düz, Sağa ve Sola dönüş şeritleri aşağıdadır.</Alert>
       <Grid container spacing={2}>
         <Grid item xs={12} md={8}>
           <Card>
             <CardContent>
               <Box display="flex" justifyContent="space-between" mb={2} alignItems="center">
                  <Typography variant="h6">Tanımlı Şeritler (12 Adet)</Typography>
                  <Button startIcon={<AddCircleIcon />} size="small" disabled={isReadOnly}>Yeni Ekle</Button>
               </Box>
               <Divider sx={{ mb: 2 }}/>
               <Box sx={{ maxHeight: '400px', overflow: 'auto' }}> 
                 <List>
                   {initialLanes.map((lane) => (
                     <ListItem key={lane.id} divider>
                       <ListItemIcon sx={{ color: '#1a237e' }}>{lane.icon}</ListItemIcon>
                       <ListItemText primary={lane.label} secondary={`ID: ${lane.id} | Dedektör: AKTİF`} />
                       <Chip label="Araç" size="small" color="primary" variant="outlined" />
                     </ListItem>
                   ))}
                 </List>
               </Box>
             </CardContent>
           </Card>
         </Grid>
         <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h6">Sinyal Fazları</Typography>
                <Box sx={{ mt: 2 }}>
                  <TextField disabled={isReadOnly} fullWidth label="Döngü Süresi (sn)" defaultValue="90" type="number" margin="dense" />
                  <TextField disabled={isReadOnly} fullWidth label="Min Yeşil Süre" defaultValue="10" type="number" margin="dense" />
                  <TextField disabled={isReadOnly} fullWidth label="Sarı Işık Süresi" defaultValue="3" type="number" margin="dense" />
                </Box>
              </CardContent>
            </Card>
         </Grid>
       </Grid>
    </>
  );
}
