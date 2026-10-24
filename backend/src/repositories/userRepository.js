const { pool } = require('../config/database');

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT id, name, username, email, role, avatar_url, bio, is_active, last_login_at, created_at, updated_at
     FROM users WHERE id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findByEmail(email) {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE email = ?`,
    [email.toLowerCase()]
  );
  return rows[0] || null;
}

async function findByUsername(username) {
  const [rows] = await pool.execute(
    `SELECT * FROM users WHERE username = ?`,
    [username.toLowerCase()]
  );
  return rows[0] || null;
}

async function create({ name, username, email, passwordHash, role = 'gamer', avatarUrl = null, bio = null }) {
  const [result] = await pool.execute(
    `INSERT INTO users (name, username, email, password_hash, role, avatar_url, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, username.toLowerCase(), email.toLowerCase(), passwordHash, role, avatarUrl, bio]
  );
  return findById(result.insertId);
}

async function updateLastLogin(id) {
  await pool.execute(
    `UPDATE users SET last_login_at = NOW() WHERE id = ?`,
    [id]
  );
}

async function updateProfile(id, { name, bio, avatarUrl }) {
  await pool.execute(
    `UPDATE users
     SET name = COALESCE(?, name),
         bio = COALESCE(?, bio),
         avatar_url = COALESCE(?, avatarUrl)
     WHERE id = ?`,
    [name, bio, avatarUrl, id]
  );
  return findById(id);
}

async function findAll({ page = 1, limit = 20, role, search, status } = {}) {
  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];

  if (role) {
    whereClauses.push('role = ?');
    params.push(role);
  }
  if (status !== undefined && status !== '') {
    whereClauses.push('is_active = ?');
    params.push(status === 'active' || status === true || status === '1' ? 1 : 0);
  }
  if (search) {
    whereClauses.push('(name LIKE ? OR username LIKE ? OR email LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [countResult] = await pool.execute(
    `SELECT COUNT(*) as total FROM users ${whereSql}`,
    params
  );
  const total = countResult[0].total;

  const [rows] = await pool.execute(
    `SELECT id, name, username, email, role, avatar_url, bio, is_active, last_login_at, created_at, updated_at
     FROM users ${whereSql}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, String(limit), String(offset)]
  );

  return {
    users: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

async function toggleActiveStatus(id, isActive) {
  await pool.execute(
    `UPDATE users SET is_active = ? WHERE id = ?`,
    [isActive ? 1 : 0, id]
  );
  return findById(id);
}

module.exports = {
  findById,
  findByEmail,
  findByUsername,
  create,
  updateLastLogin,
  updateProfile,
  findAll,
  toggleActiveStatus
};
