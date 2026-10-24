const { pool } = require('../config/database');

async function getStats({ startDate = null, endDate = null } = {}) {
  const [userStats] = await pool.execute(
    `SELECT
       COUNT(*) as total_users,
       SUM(CASE WHEN role = 'gamer' THEN 1 ELSE 0 END) as total_gamers,
       SUM(CASE WHEN role = 'developer' THEN 1 ELSE 0 END) as total_developers,
       SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as total_admins,
       SUM(CASE WHEN created_at >= CURDATE() THEN 1 ELSE 0 END) as users_today,
       SUM(CASE WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 1 ELSE 0 END) as users_this_week,
       SUM(CASE WHEN created_at >= NOW() - INTERVAL 30 DAY THEN 1 ELSE 0 END) as users_this_month
     FROM users`
  );

  const [gameStats] = await pool.execute(
    `SELECT
       COUNT(*) as total_games,
       SUM(CASE WHEN is_featured = 1 THEN 1 ELSE 0 END) as featured_games,
       SUM(CASE WHEN status = 'published' THEN 1 ELSE 0 END) as published_games,
       SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) as draft_games,
       SUM(CASE WHEN created_at >= CURDATE() THEN 1 ELSE 0 END) as games_today,
       SUM(CASE WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 1 ELSE 0 END) as games_this_week
     FROM games`
  );

  const [reviewStats] = await pool.execute(
    `SELECT
       COUNT(*) as total_reviews,
       SUM(CASE WHEN created_at >= CURDATE() THEN 1 ELSE 0 END) as reviews_today,
       SUM(CASE WHEN created_at >= NOW() - INTERVAL 7 DAY THEN 1 ELSE 0 END) as reviews_this_week,
       AVG(rating) as global_avg_rating
     FROM reviews`
  );

  const [forumStats] = await pool.execute(
    `SELECT
       (SELECT COUNT(*) FROM threads WHERE deleted_at IS NULL) as total_threads,
       (SELECT COUNT(*) FROM posts WHERE is_deleted = 0) as total_posts`
  );

  let dateFilter = 'created_at >= NOW() - INTERVAL 30 DAY';
  const timelineParams = [];
  if (startDate && endDate) {
    dateFilter = 'created_at BETWEEN ? AND ?';
    timelineParams.push(startDate, endDate);
  }

  const [userTimeline] = await pool.execute(
    `SELECT DATE(created_at) as date, COUNT(*) as count
     FROM users
     WHERE ${dateFilter}
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    timelineParams
  );

  const [reviewTimeline] = await pool.execute(
    `SELECT DATE(created_at) as date, COUNT(*) as count
     FROM reviews
     WHERE ${dateFilter}
     GROUP BY DATE(created_at)
     ORDER BY date ASC`,
    timelineParams
  );

  const [topGames] = await pool.execute(
    `SELECT id, title, slug, cover_image_url, average_rating, review_count, is_featured
     FROM games
     WHERE status = 'published'
     ORDER BY review_count DESC, average_rating DESC
     LIMIT 5`
  );

  return {
    users: userStats[0],
    games: gameStats[0],
    reviews: reviewStats[0],
    forum: forumStats[0],
    top_games: topGames,
    timeline: {
      user_registrations: userTimeline,
      reviews: reviewTimeline
    }
  };
}

async function getAllReviews({ page = 1, limit = 20, search = '' } = {}) {
  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(r.review_text LIKE ? OR u.name LIKE ? OR g.title LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN games g ON r.game_id = g.id
     ${whereSql}`,
    params
  );
  const total = countRes[0].total;

  const [reviews] = await pool.execute(
    `SELECT r.*, u.name as user_name, u.email as user_email, u.avatar_url as user_avatar,
            g.title as game_title, g.slug as game_slug
     FROM reviews r
     JOIN users u ON r.user_id = u.id
     JOIN games g ON r.game_id = g.id
     ${whereSql}
     ORDER BY r.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, String(limit), String(offset)]
  );

  return {
    reviews,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

async function getAllThreads({ page = 1, limit = 20, search = '' } = {}) {
  const offset = (page - 1) * limit;
  const whereClauses = [];
  const params = [];

  if (search) {
    whereClauses.push('(t.title LIKE ? OR t.content LIKE ? OR u.name LIKE ? OR g.title LIKE ?)');
    const term = `%${search}%`;
    params.push(term, term, term, term);
  }

  const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM threads t
     JOIN users u ON t.user_id = u.id
     JOIN games g ON t.game_id = g.id
     ${whereSql}`,
    params
  );
  const total = countRes[0].total;

  const [threads] = await pool.execute(
    `SELECT t.*, u.name as author_name, u.email as author_email,
            g.title as game_title, g.slug as game_slug,
            (SELECT COUNT(*) FROM posts p WHERE p.thread_id = t.id AND p.is_deleted = 0) as reply_count
     FROM threads t
     JOIN users u ON t.user_id = u.id
     JOIN games g ON t.game_id = g.id
     ${whereSql}
     ORDER BY t.created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, String(limit), String(offset)]
  );

  return {
    threads,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

module.exports = {
  getStats,
  getAllReviews,
  getAllThreads
};
