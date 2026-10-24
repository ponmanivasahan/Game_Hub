const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const isRemoteDb = Boolean(
  process.env.DATABASE_URL ||
  process.env.MYSQL_URL ||
  (process.env.DB_HOST && !['127.0.0.1', 'localhost'].includes(process.env.DB_HOST))
);

module.exports = {
  port: process.env.PORT || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'indiegamer_hub_secret_key_change_in_production_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  db: {
    url: process.env.DATABASE_URL || process.env.MYSQL_URL || null,
    host: process.env.DB_HOST || '127.0.0.1',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'indiegamer_hub',
    connectionLimit: parseInt(process.env.DB_CONNECTION_LIMIT || '10', 10),
    waitForConnections: true,
    queueLimit: 0,
    timezone: 'Z',
    ssl: (process.env.DB_SSL === 'true' || process.env.MYSQL_SSL === 'true' || isRemoteDb)
      ? { rejectUnauthorized: false }
      : undefined
  },
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  steamApiKey: process.env.STEAM_API_KEY || ''
};
