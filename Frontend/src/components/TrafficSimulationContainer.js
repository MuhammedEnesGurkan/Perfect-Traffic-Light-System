import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Container, Grid, Paper, Button, Stack, Slider, Link } from '@mui/material';
import TrafficMap from './TrafficMap';

// --- TERMINAL COMPONENT ---
const TerminalContainer = ({ logs }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [logs]);

    return (
        <Paper sx={{
            height: '350px',
            bgcolor: 'rgba(20, 20, 20, 0.95)',
            border: '1px solid #333',
            borderRadius: 2,
            p: 2,
            fontFamily: '"Fira Code", monospace',
            fontSize: '0.85rem',
            color: '#00e676',
            overflowY: 'auto',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            flexDirection: 'column'
        }} ref={scrollRef}>
            <Box sx={{ borderBottom: '1px solid #333', pb: 1, mb: 1, display: 'flex', alignItems: 'center' }}>
                <Typography variant="caption" sx={{ color: '#888' }}>SIMULATION KERNEL LOGS</Typography>
            </Box>
            {logs.map((log, index) => (
                <Box key={index} sx={{ mb: 0.5, opacity: 0.9 }}>
                    <span style={{ color: '#666', marginRight: '10px' }}>[{log.time}]</span>
                    <span style={{ color: log.type === 'INFO' ? '#29b6f6' : log.type === 'WARN' ? '#ffa726' : log.type === 'CRITICAL' ? '#ff1744' : '#66bb6a' }}>
                        {log.type}
                    </span>
                    <span style={{ color: '#aaa', marginLeft: '10px' }}>{`>`}</span>
                    <span style={{ marginLeft: '10px', color: '#eee' }}>{log.message}</span>
                </Box>
            ))}
        </Paper>
    );
};

// --- DATA SERVICE MOCK (Ideally imported) ---
const sendMetricToBackend = async (data) => {
    // Attempt to post to local backend
    // Intersection ID 1 is assumed
    try {
        const response = await fetch('/api/intersections/1/metrics', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        return response.ok;
    } catch (e) {
        console.error("Backend Error", e);
        return false;
    }
};

// --- MAIN SIMULATION CONTAINER ---
const TrafficSimulationContainer = () => {
    // Phases: NS_GREEN, NS_YELLOW, ALL_RED_1, EW_GREEN, EW_YELLOW, ALL_RED_2
    const [phase, setPhase] = useState('NS_GREEN');
    const [timeLeft, setTimeLeft] = useState(15);
    const [mode, setMode] = useState('NORMAL');
    const [spawnRate, setSpawnRate] = useState(1.0); // Cars per sec approx
    const [logs, setLogs] = useState([]);

    // Stats from Map
    const [liveStats, setLiveStats] = useState({ activeCars: 0, totalWait: 0, totalThroughput: 0 });

    const addLog = (message, type = 'INFO') => {
        const time = new Date().toLocaleTimeString('en-US', { hour12: false });
        setLogs(prev => [...prev.slice(-19), { time, message, type }]);
    };

    // --- TRAFFIC LIGHT STATES ---
    const getLights = () => {
        let ns = 'red';
        let ew = 'red';

        if (mode === 'EMERGENCY') { ns = 'red'; ew = 'red'; }
        else if (mode === 'MAINTENANCE') { ns = 'yellow'; ew = 'red'; }
        else {
            if (phase === 'NS_GREEN') ns = 'green';
            if (phase === 'NS_YELLOW') ns = 'yellow';
            if (phase === 'EW_GREEN') ew = 'green';
            if (phase === 'EW_YELLOW') ew = 'yellow';
        }
        return { NS: ns, EW: ew };
    };

    // --- TIMER & LOGIC ---
    useEffect(() => {
        if (mode !== 'NORMAL') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    switch (phase) {
                        case 'NS_GREEN': setPhase('NS_YELLOW'); return 3;
                        case 'NS_YELLOW': setPhase('ALL_RED_1'); return 2;
                        case 'ALL_RED_1': setPhase('EW_GREEN'); return 15;
                        case 'EW_GREEN': setPhase('EW_YELLOW'); return 3;
                        case 'EW_YELLOW': setPhase('ALL_RED_2'); return 2;
                        case 'ALL_RED_2': setPhase('NS_GREEN'); return 15;
                        default: return 15;
                    }
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [phase, mode]);

    // --- BACKEND SYNC LOOP ---
    useEffect(() => {
        const syncInterval = setInterval(async () => {
            if (liveStats.totalThroughput === 0) return; // Don't spam empty stats

            const metricData = {
                // Mapping simulation stats to Entity expected fields
                intersectionId: 1, // Required by DTO @NotNull
                measurementDate: new Date().toISOString().split('T')[0],
                measurementHour: new Date().getHours(),
                totalVehicleCount: liveStats.totalThroughput,
                averageWaitTime: liveStats.activeCars > 0 ? (liveStats.totalWait / liveStats.activeCars).toFixed(2) : 0,
                carCount: liveStats.activeCars // Simply mapping active as count for now
            };

            const success = await sendMetricToBackend(metricData);
            if (success) {
                addLog(`Data Synced to DB: ${liveStats.totalThroughput} vehicles handled.`, 'SUCCESS');
            } else {
                addLog('Backend Sync Failed: Is Spring Boot running?', 'WARN');
            }

        }, 5000); // Sync every 5s

        return () => clearInterval(syncInterval);
    }, [liveStats]);

    // --- PERFECT FLOW AI LOGIC ---
    const handleDemand = (direction) => { // 'NS' or 'EW'
        if (mode !== 'PERFECT_FLOW') return;

        // If we are already green for this direction, extend it
        if ((direction === 'NS' && phase === 'NS_GREEN') || (direction === 'EW' && phase === 'EW_GREEN')) {
            // Reset timer slightly to avoid jitter, but allow rapid switches
            // setTimeLeft(5); 
            return;
        }

        // ZERO-BUFFER SWITCHING (Instant Toggle)
        // Bypass Yellow/Red phases completely
        if (direction === 'NS' && phase === 'EW_GREEN') {
            setPhase('NS_GREEN');
            setTimeLeft(20); // Give it some green time
            addLog('AI: Instant Switch EW -> NS (Zero Buffer)', 'SUCCESS');
        }

        if (direction === 'EW' && phase === 'NS_GREEN') {
            setPhase('EW_GREEN');
            setTimeLeft(20);
            addLog('AI: Instant Switch NS -> EW (Zero Buffer)', 'SUCCESS');
        }
    };


    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#050505',
            color: 'white',
            pt: 4,
            pb: 4
        }}>
            <Container maxWidth="xl">
                {/* HEADER */}
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            <span style={{ color: '#2979ff' }}>AI</span> TRAFFIC SIMULATION
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#888' }}>
                            REAL-TIME CANVAS ENGINE • DB CONNECTED
                        </Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h3" sx={{ fontFamily: 'monospace', fontWeight: 'bold', color: '#fff' }}>
                            {String(timeLeft).padStart(2, '0')}s
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#666' }}>NEXT PHASE</Typography>
                    </Box>
                </Box>

                <Grid container spacing={4}>
                    {/* LEFT: MAP */}
                    <Grid item xs={12} lg={8}>
                        <TrafficMap
                            lights={getLights()}
                            spawnRate={spawnRate}
                            onStatsUpdate={setLiveStats}
                            onDemand={handleDemand}
                        />

                        <Box sx={{ mt: 2, display: 'flex', gap: 4 }}>
                            <Box>
                                <Typography variant="caption" color="#888">ACTIVE VEHICLES</Typography>
                                <Typography variant="h5">{liveStats.activeCars}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="#888">TOTAL PROCESSED</Typography>
                                <Typography variant="h5">{liveStats.totalThroughput}</Typography>
                            </Box>
                        </Box>
                    </Grid>

                    {/* RIGHT: CONTROLS */}
                    <Grid item xs={12} lg={4}>
                        <Stack spacing={3}>

                            {/* DENSITY CONTROL */}
                            <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #333' }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Traffic Density</Typography>
                                <Slider
                                    value={spawnRate}
                                    min={0.2} max={5.0} step={0.1}
                                    onChange={(e, v) => setSpawnRate(v)}
                                    valueLabelDisplay="auto"
                                    sx={{ color: '#2979ff' }}
                                />
                                <Typography variant="caption" sx={{ color: '#aaa' }}>
                                    Current Ratio: {spawnRate.toFixed(1)}x
                                </Typography>
                            </Paper>

                            {/* MANUAL CONTROL */}
                            <Paper sx={{ p: 3, bgcolor: '#1a1a1a', border: '1px solid #333' }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>Override Controls</Typography>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth variant={mode === 'NORMAL' ? "contained" : "outlined"}
                                            onClick={() => setMode('NORMAL')}
                                        >
                                            AUTO CYCLE
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth variant={mode === 'PERFECT_FLOW' ? "contained" : "outlined"}
                                            color="secondary"
                                            onClick={() => setMode('PERFECT_FLOW')}
                                            sx={{ boxShadow: mode === 'PERFECT_FLOW' ? '0 0 15px #d500f9' : 'none' }}
                                        >
                                            PERFECT AI FLOW
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth variant={mode === 'EMERGENCY' ? "contained" : "outlined"}
                                            color="error"
                                            onClick={() => setMode('EMERGENCY')}
                                        >
                                            EMERGENCY
                                        </Button>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <Button
                                            fullWidth variant={mode === 'MAINTENANCE' ? "contained" : "outlined"}
                                            color="warning"
                                            onClick={() => setMode('MAINTENANCE')}
                                        >
                                            MAINTENANCE
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Paper>

                            <TerminalContainer logs={logs} />
                        </Stack>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
};

export default TrafficSimulationContainer;
