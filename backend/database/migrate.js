const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const env = require('../src/config/env');

async function runMigrations() {
  console.log('[Migration] Connecting to MySQL with multipleStatements...');
  const connectionConfig = env.db.url
    ? {
        uri: env.db.url,
        multipleStatements: true,
        ...(env.db.ssl ? { ssl: env.db.ssl } : {})
      }
    : {
        host: env.db.host,
        port: env.db.port,
        user: env.db.user,
        password: env.db.password,
        database: env.db.database,
        multipleStatements: true,
        ...(env.db.ssl ? { ssl: env.db.ssl } : {})
      };

  const connection = await mysql.createConnection(connectionConfig);

  try {
    const migrationFile = path.resolve(__dirname, 'migrations/001_initial_schema.sql');
    const sql = fs.readFileSync(migrationFile, 'utf8');

    await connection.query(sql);
    console.log('[Migration] All schema tables created successfully.');
  } catch (error) {
    console.error('[Migration] Migration error:', error.message);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runMigrations;
