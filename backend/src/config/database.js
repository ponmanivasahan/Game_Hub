const mysql = require('mysql2/promise');
const env = require('./env');

const poolConfig = env.db.url
  ? {
      uri: env.db.url,
      waitForConnections: env.db.waitForConnections,
      connectionLimit: env.db.connectionLimit,
      queueLimit: env.db.queueLimit,
      timezone: env.db.timezone,
      decimalNumbers: true,
      ...(env.db.ssl ? { ssl: env.db.ssl } : {})
    }
  : {
      host: env.db.host,
      port: env.db.port,
      user: env.db.user,
      password: env.db.password,
      database: env.db.database,
      waitForConnections: env.db.waitForConnections,
      connectionLimit: env.db.connectionLimit,
      queueLimit: env.db.queueLimit,
      timezone: env.db.timezone,
      decimalNumbers: true,
      ...(env.db.ssl ? { ssl: env.db.ssl } : {})
    };

const pool = mysql.createPool(poolConfig);

async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}

async function transaction(callback) {
  const connection = await pool.getConnection();
  await connection.beginTransaction();
  try {
    const result = await callback(connection);
    await connection.commit();
    return result;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = {
  pool,
  query,
  transaction
};
