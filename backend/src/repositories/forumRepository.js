const { pool, transaction } = require('../config/database');

async function findThreadsByGame(gameId, { page = 1, limit = 10 } = {}) {
  const offset = (page - 1) * limit;

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM threads WHERE game_id = ? AND deleted_at IS NULL`,
    [gameId]
  );
  const total = countRes[0].total;

  const [threads] = await pool.execute(
    `SELECT t.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar,
            (SELECT COUNT(*) FROM posts p WHERE p.thread_id = t.id AND p.is_deleted = 0) as reply_count
     FROM threads t
     JOIN users u ON t.user_id = u.id
     WHERE t.game_id = ? AND t.deleted_at IS NULL
     ORDER BY t.last_activity_at DESC
     LIMIT ? OFFSET ?`,
    [gameId, String(limit), String(offset)]
  );

  return {
    threads,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

async function findRecentThreads(limit = 8) {
  const [threads] = await pool.execute(
    `SELECT t.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar,
            g.title as game_title, g.slug as game_slug, g.cover_image_url as game_cover,
            (SELECT COUNT(*) FROM posts p WHERE p.thread_id = t.id AND p.is_deleted = 0) as reply_count
     FROM threads t
     JOIN users u ON t.user_id = u.id
     JOIN games g ON t.game_id = g.id
     WHERE t.deleted_at IS NULL
     ORDER BY t.last_activity_at DESC
     LIMIT ?`,
    [String(limit)]
  );
  return threads;
}

async function findThreadById(id) {
  const [rows] = await pool.execute(
    `SELECT t.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar,
            g.title as game_title, g.slug as game_slug
     FROM threads t
     JOIN users u ON t.user_id = u.id
     JOIN games g ON t.game_id = g.id
     WHERE t.id = ? AND t.deleted_at IS NULL`,
    [id]
  );
  return rows[0] || null;
}

async function createThread({ gameId, userId, title, content }) {
  return transaction(async (conn) => {
    const [result] = await conn.execute(
      `INSERT INTO threads (game_id, user_id, title, content, last_activity_at)
       VALUES (?, ?, ?, ?, NOW())`,
      [gameId, userId, title, content]
    );
    const threadId = result.insertId;

    await conn.execute(
      `INSERT INTO user_activity (user_id, activity_type, game_id, reference_id, metadata)
       VALUES (?, 'thread_created', ?, ?, ?)`,
      [userId, gameId, threadId, JSON.stringify({ title })]
    );

    return findThreadById(threadId);
  });
}

async function lockThread(id, isLocked) {
  await pool.execute(
    `UPDATE threads SET is_locked = ?, locked_at = IF(?, NOW(), NULL) WHERE id = ?`,
    [isLocked ? 1 : 0, isLocked ? 1 : 0, id]
  );
  return findThreadById(id);
}

async function deleteThread(id, userId = null, isAdmin = false) {
  if (isAdmin) {
    const [res] = await pool.execute(`UPDATE threads SET deleted_at = NOW() WHERE id = ?`, [id]);
    return res.affectedRows > 0;
  }
  const [res] = await pool.execute(`UPDATE threads SET deleted_at = NOW() WHERE id = ? AND user_id = ?`, [id, userId]);
  return res.affectedRows > 0;
}

async function findPostsByThread(threadId, { page = 1, limit = 20 } = {}) {
  const offset = (page - 1) * limit;

  const [countRes] = await pool.execute(
    `SELECT COUNT(*) as total FROM posts WHERE thread_id = ? AND is_deleted = 0`,
    [threadId]
  );
  const total = countRes[0].total;

  const [posts] = await pool.execute(
    `SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar, u.role as author_role
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.thread_id = ? AND p.is_deleted = 0
     ORDER BY p.created_at ASC
     LIMIT ? OFFSET ?`,
    [threadId, String(limit), String(offset)]
  );

  return {
    posts,
    total,
    page: Number(page),
    limit: Number(limit),
    totalPages: Math.ceil(total / limit)
  };
}

async function createPost({ threadId, userId, content }) {
  return transaction(async (conn) => {
    const [thread] = await conn.execute(`SELECT id, game_id, is_locked FROM threads WHERE id = ?`, [threadId]);
    if (!thread[0]) throw new Error('Thread not found');
    if (thread[0].is_locked) throw new Error('This thread is locked for new replies');

    const [result] = await conn.execute(
      `INSERT INTO posts (thread_id, user_id, content) VALUES (?, ?, ?)`,
      [threadId, userId, content]
    );
    const postId = result.insertId;

    await conn.execute(`UPDATE threads SET last_activity_at = NOW() WHERE id = ?`, [threadId]);

    await conn.execute(
      `INSERT INTO user_activity (user_id, activity_type, game_id, reference_id)
       VALUES (?, 'post_created', ?, ?)`,
      [userId, thread[0].game_id, postId]
    );

    const [post] = await conn.execute(
      `SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar, u.role as author_role
       FROM posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [postId]
    );

    return post[0];
  });
}

async function updatePost(id, userId, content) {
  const [res] = await pool.execute(
    `UPDATE posts SET content = ?, updated_at = NOW() WHERE id = ? AND user_id = ?`,
    [content, id, userId]
  );
  if (res.affectedRows === 0) return null;

  const [rows] = await pool.execute(
    `SELECT p.*, u.name as author_name, u.username as author_username, u.avatar_url as author_avatar
     FROM posts p
     JOIN users u ON p.user_id = u.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
}

async function deletePost(id, userId = null, isAdmin = false) {
  let res;
  if (isAdmin) {
    [res] = await pool.execute(
      `UPDATE posts SET is_deleted = 1, deleted_at = NOW() WHERE id = ?`,
      [id]
    );
  } else {
    [res] = await pool.execute(
      `UPDATE posts SET is_deleted = 1, deleted_at = NOW() WHERE id = ? AND user_id = ?`,
      [id, userId]
    );
  }
  return res.affectedRows > 0;
}

module.exports = {
  findThreadsByGame,
  findRecentThreads,
  findThreadById,
  createThread,
  lockThread,
  deleteThread,
  findPostsByThread,
  createPost,
  updatePost,
  deletePost
};
