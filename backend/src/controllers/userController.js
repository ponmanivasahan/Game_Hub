const userRepository = require('../repositories/userRepository');
const { pool } = require('../config/database');

async function getUserProfile(req, res, next) {
  try {
    const username = req.params.username;
    const user = await userRepository.findByUsername(username);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found.'
      });
    }

    const [reviews] = await pool.execute(
      `SELECT r.*, g.title as game_title, g.slug as game_slug, g.cover_image_url as game_cover
       FROM reviews r
       JOIN games g ON r.game_id = g.id
       WHERE r.user_id = ?
       ORDER BY r.created_at DESC
       LIMIT 10`,
      [user.id]
    );

    const [threads] = await pool.execute(
      `SELECT t.*, g.title as game_title, g.slug as game_slug
       FROM threads t
       JOIN games g ON t.game_id = g.id
       WHERE t.user_id = ? AND t.deleted_at IS NULL
       ORDER BY t.created_at DESC
       LIMIT 10`,
      [user.id]
    );

    let developedGames = [];
    if (user.role === 'developer') {
      const [games] = await pool.execute(
        `SELECT id, title, slug, cover_image_url, average_rating, review_count, release_date, is_featured, status
         FROM games
         WHERE developer_id = ?
         ORDER BY created_at DESC`,
        [user.id]
      );
      developedGames = games;
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
          avatar_url: user.avatar_url,
          bio: user.bio,
          created_at: user.created_at
        },
        reviews,
        threads,
        games: developedGames
      }
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getUserProfile
};
