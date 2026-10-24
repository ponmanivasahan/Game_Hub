const runMigrations = require('./migrate');
const seedDatabase = require('./seed/seed');
const { pool } = require('../src/config/database');
const env = require('../src/config/env');

async function resetDatabase() {
  if (env.nodeEnv === 'production') {
    throw new Error('Database reset is disabled in production environment.');
  }

  console.log('[Reset] Starting database reset...');
  const conn = await pool.getConnection();

  try {
    console.log('[Reset] Dropping all tables...');
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    const [tables] = await conn.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema = ?`,
      [env.db.database]
    );

    for (const t of tables) {
      const tableName = t.table_name || t.TABLE_NAME;
      await conn.query(`DROP TABLE IF EXISTS \`${tableName}\``);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log(`[Reset] Dropped ${tables.length} tables.`);
  } finally {
    conn.release();
  }

  await runMigrations();

  await seedDatabase();

  console.log('[Reset] Database reset and reseeded successfully.');
}

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = resetDatabase;
