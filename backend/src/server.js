const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');
const runMigrations = require('../database/migrate');
const seedDatabase = require('../database/seed/seed');

async function startServer() {
  const PORT = env.port;
  const server = app.listen(PORT, async () => {
    console.log(`[Server] IndieGamer Hub running on port ${PORT}`);
    try {
      const connection = await pool.getConnection();
      connection.release();
      console.log('[Database] Connected to MySQL database successfully.');

      try {
        await runMigrations();
        const [users] = await pool.query('SELECT COUNT(*) as count FROM users');
        if (users[0].count === 0) {
          console.log('[Database] Database is empty, seeding initial data...');
          await seedDatabase();
        }
      } catch (migErr) {
        console.warn('[Database] Migration/Seed notice:', migErr.message);
      }
    } catch (dbErr) {
      console.error('[Database Warning] Failed to connect to MySQL database:', dbErr.message);
      console.error('[Database Warning] Set DATABASE_URL or MYSQL_URL in your environment to connect to a cloud database.');
    }
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`[Server Error] Port ${PORT} is already in use.`);
      if (PORT === 5000) {
        console.error('[Server Tip] On macOS, port 5000 is occupied by Apple AirPlay Receiver (ControlCenter).');
        console.error('[Server Tip] Disable AirPlay Receiver in System Settings -> General -> AirDrop & Handoff, or set PORT=5001.');
      }
    } else {
      console.error('[Server Error]', err.message);
    }
    process.exit(1);
  });

  const handleShutdown = async (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      try {
        await pool.end();
        console.log('[Server] MySQL pool closed. Exiting process.');
      } catch (e) {}
      process.exit(0);
    });
  };

  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
  process.on('SIGINT', () => handleShutdown('SIGINT'));
}

startServer();
