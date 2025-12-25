import app from './app';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('🚦 ═══════════════════════════════════════════════════════');
  console.log(`🚀 Perfect Traffic Lights API Server`);
  console.log(`📡 Running on: http://localhost:${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('🚦 ═══════════════════════════════════════════════════════');
  console.log('');
  console.log('📚 Available Endpoints:');
  console.log('');
  console.log('🔓 Public:');
  console.log(`   GET  /api/health`);
  console.log(`   POST /api/auth/login`);
  console.log('');
  console.log('🔒 Protected:');
  console.log(`   GET  /api/intersections`);
  console.log(`   GET  /api/intersections/:id`);
  console.log(`   GET  /api/intersections/:id/metrics`);
  console.log(`   POST /api/intersections/:id/sensors/data`);
  console.log(`   POST /api/intersections/:id/emergency`);
  console.log(`   GET  /api/system/health`);
  console.log('');
  console.log('👑 Admin Only:');
  console.log(`   POST /api/intersections/:id/mode`);
  console.log(`   PUT  /api/intersections/:id/config`);
  console.log('');
  console.log('🧪 Test Users:');
  console.log('   Admin: admin@traffic.com / admin123');
  console.log('   User:  user@traffic.com / user123');
  console.log('🚦 ═══════════════════════════════════════════════════════');
});