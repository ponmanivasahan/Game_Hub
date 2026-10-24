const app = require('./app');
const env = require('./config/env');
const { pool } = require('./config/database');

async function startServer() {
  try {
    const connection = await pool.getConnection();
    connection.release();
    console.log('[Database] Connected to MySQL database successfully.');

    const PORT = env.port;
    const server = app.listen(PORT, () => {
      console.log(`[Server] IndieGamer Hub API running on http://localhost:${PORT}`);
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
        await pool.end();
        console.log('[Server] MySQL pool closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('[Server] Failed to connect to MySQL database:', error.message);
    process.exit(1);
  }
}

startServer();
