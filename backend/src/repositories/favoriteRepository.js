const { pool, transaction } = require('../config/database');

async function isFavorite(userId, gameId) {
  const [rows] = await pool.execute(
    `SELECT 1 FROM game_favorites WHERE user_id = ? AND game_id = ?`,
    [userId, gameId]
  );
  return rows.length > 0;
}

async function addFavorite(userId, gameId) {
  return transaction(async (conn) => {
    await conn.execute(
      `INSERT IGNORE INTO game_favorites (user_id, game_id) VALUES (?, ?)`,
      [userId, gameId]
    );
    await conn.execute(
      `INSERT INTO user_activity (user_id, activity_type, game_id) VALUES (?, 'game_favorited', ?)`,
      [userId, gameId]
    );
    return true;
  });
}

async function removeFavorite(userId, gameId) {
  const [res] = await pool.execute(
    `DELETE FROM game_favorites WHERE user_id = ? AND game_id = ?`,
    [userId, gameId]
  );
  return res.affectedRows > 0;
}

async function getUserFavorites(userId, { page = 1, limit = 12 } = {}) {
  const offset = (page - 1) * limit;

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM game_favorites WHERE user_id = ?`,
    [userId]
  );
  const total = countRes[0].total;

  const [games] = await pool.execute(
    `SELECT g.*, f.created_at as favorited_at, u.name as developer_name, u.username as developer_username
     FROM game_favorites f
     JOIN games g ON f.game_id = g.id
     LEFT JOIN users u ON g.developer_id = u.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC
     LIMIT ? OFFSET ?`,
    [userId, String(limit), String(offset)]
  );

  return {
    games,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

module.exports = {
  isFavorite,
  addFavorite,
  removeFavorite,
  getUserFavorites
};
