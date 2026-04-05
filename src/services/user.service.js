const { pool } = require('../config/database');

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
};

const findById = async (id) => {
  const result = await pool.query(
    'SELECT id, full_name, email, avatar_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return result.rows[0] || null;
};

const create = async ({ full_name, email, password_hash }) => {
  const result = await pool.query(
    `INSERT INTO users (full_name, email, password_hash)
     VALUES ($1, $2, $3)
     RETURNING id, full_name, email, created_at`,
    [full_name, email, password_hash]
  );
  return result.rows[0];
};

const update = async (id, { full_name, avatar_url }) => {
  const result = await pool.query(
    `UPDATE users
     SET full_name = COALESCE($1, full_name),
         avatar_url = COALESCE($2, avatar_url),
         updated_at = NOW()
     WHERE id = $3
     RETURNING id, full_name, email, avatar_url`,
    [full_name, avatar_url, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
  return result.rows[0] || null;
};

module.exports = { findByEmail, findById, create, update, remove };
