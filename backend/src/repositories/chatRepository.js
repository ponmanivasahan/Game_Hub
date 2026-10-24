const { pool } = require('../config/database');

async function getMessages(channel = 'general', limit = 50) {
  const [rows] = await pool.execute(
    `SELECT m.id, m.channel, m.message, m.created_at,
            u.id as user_id, u.name as user_name, u.username as user_username,
            u.avatar_url as user_avatar, u.role as user_role
     FROM chat_messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.channel = ?
     ORDER BY m.created_at ASC
     LIMIT ?`,
    [channel, String(limit)]
  );
  return rows;
}

async function createMessage(userId, channel = 'general', message) {
  const [res] = await pool.execute(
    `INSERT INTO chat_messages (user_id, channel, message) VALUES (?, ?, ?)`,
    [userId, channel, message]
  );

  const [rows] = await pool.execute(
    `SELECT m.id, m.channel, m.message, m.created_at,
            u.id as user_id, u.name as user_name, u.username as user_username,
            u.avatar_url as user_avatar, u.role as user_role
     FROM chat_messages m
     JOIN users u ON m.user_id = u.id
     WHERE m.id = ?`,
    [res.insertId]
  );

  return rows[0];
}

module.exports = {
  getMessages,
  createMessage
};
