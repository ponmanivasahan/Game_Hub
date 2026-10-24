const { pool, transaction } = require('../config/database');
const { updateCachedRating } = require('./gameRepository');

async function findById(id) {
  const [rows] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.username as user_username, u.avatar_url as user_avatar,
            g.title as game_title, g.slug as game_slug
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN games g ON r.game_id = g.id
     WHERE r.id = ?`,
    [id]
  );
  return rows[0] || null;
}

async function findByGameAndUser(gameId, userId) {
  const [rows] = await pool.execute(
    `SELECT * FROM reviews WHERE game_id = ? AND user_id = ?`,
    [gameId, userId]
  );
  return rows[0] || null;
}

async function findByGameId(gameId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM reviews WHERE game_id = ?`,
    [gameId]
  );
  const total = countRes[0].total;

  const [rows] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.username as user_username, u.avatar_url as user_avatar
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     WHERE r.game_id = ?
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [gameId, String(limit), String(offset)]
  );

  return {
    reviews: rows,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

async function getRatingDistribution(gameId) {
  const [rows] = await pool.execute(
    `SELECT rating, COUNT(*) as count
     FROM reviews
     WHERE game_id = ?
     GROUP BY rating
     ORDER BY rating DESC`,
    [gameId]
  );

  const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  let total = 0;
  for (const r of rows) {
    distribution[r.rating] = Number(r.count);
    total += Number(r.count);
  }

  return {
    distribution,
    total
  };
}

async function createReview({ gameId, userId, rating, reviewText }) {
  return transaction(async (conn) => {
    const [res] = await conn.execute(
      `INSERT INTO reviews (game_id, user_id, rating, review_text)
       VALUES (?, ?, ?, ?)`,
      [gameId, userId, rating, reviewText]
    );
    const reviewId = res.insertId;

    await updateCachedRating(gameId, conn);

    await conn.execute(
      `INSERT INTO user_activity (user_id, activity_type, game_id, reference_id, metadata)
       VALUES (?, 'review_created', ?, ?, ?)`,
      [userId, gameId, reviewId, JSON.stringify({ rating })]
    );

    return findById(reviewId);
  });
}

async function updateReview(id, userId, { rating, reviewText }) {
  return transaction(async (conn) => {
    const [review] = await conn.execute(
      `SELECT * FROM reviews WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
    if (!review[0]) return null;

    await conn.execute(
      `UPDATE reviews
       SET rating = ?, review_text = ?, updated_at = NOW()
       WHERE id = ?`,
      [rating, reviewText, id]
    );

    await updateCachedRating(review[0].game_id, conn);

    return findById(id);
  });
}

async function deleteReview(id, userId = null, isAdmin = false) {
  return transaction(async (conn) => {
    let review;
    if (isAdmin) {
      const [rows] = await conn.execute(`SELECT * FROM reviews WHERE id = ?`, [id]);
      review = rows[0];
    } else {
      const [rows] = await conn.execute(`SELECT * FROM reviews WHERE id = ? AND user_id = ?`, [id, userId]);
      review = rows[0];
    }

    if (!review) return false;

    await conn.execute(`DELETE FROM reviews WHERE id = ?`, [id]);
    await updateCachedRating(review.game_id, conn);

    return true;
  });
}

async function getRecentReviews(limit = 6) {
  const [rows] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.username as user_username, u.avatar_url as user_avatar,
            g.title as game_title, g.slug as game_slug, g.cover_image_url as game_cover
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN games g ON r.game_id = g.id
     ORDER BY r.created_at DESC
     LIMIT ?`,
    [String(limit)]
  );
  return rows;
}

module.exports = {
  findById,
  findByGameAndUser,
  findByGameId,
  getRatingDistribution,
  createReview,
  updateReview,
  deleteReview,
  getRecentReviews
};
