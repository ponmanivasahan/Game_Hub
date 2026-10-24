const { pool } = require('../config/database');

async function getGenres() {
  const [rows] = await pool.execute(`SELECT id, name, slug FROM genres ORDER BY name ASC`);
  return rows;
}

async function getTags() {
  const [rows] = await pool.execute(`SELECT id, name, slug FROM tags ORDER BY name ASC`);
  return rows;
}

async function getPlatforms() {
  const [rows] = await pool.execute(`SELECT id, name, slug FROM platforms ORDER BY name ASC`);
  return rows;
}

async function getOrCreateGenre(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const [existing] = await pool.execute(`SELECT id, name, slug FROM genres WHERE slug = ? OR name = ?`, [slug, name]);
  if (existing.length > 0) return existing[0];
  const [res] = await pool.execute(`INSERT INTO genres (name, slug) VALUES (?, ?)`, [name, slug]);
  return { id: res.insertId, name, slug };
}

async function getOrCreateTag(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const [existing] = await pool.execute(`SELECT id, name, slug FROM tags WHERE slug = ? OR name = ?`, [slug, name]);
  if (existing.length > 0) return existing[0];
  const [res] = await pool.execute(`INSERT INTO tags (name, slug) VALUES (?, ?)`, [name, slug]);
  return { id: res.insertId, name, slug };
}

async function getOrCreatePlatform(name) {
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const [existing] = await pool.execute(`SELECT id, name, slug FROM platforms WHERE slug = ? OR name = ?`, [slug, name]);
  if (existing.length > 0) return existing[0];
  const [res] = await pool.execute(`INSERT INTO platforms (name, slug) VALUES (?, ?)`, [name, slug]);
  return { id: res.insertId, name, slug };
}

module.exports = {
  getGenres,
  getTags,
  getPlatforms,
  getOrCreateGenre,
  getOrCreateTag,
  getOrCreatePlatform
};
