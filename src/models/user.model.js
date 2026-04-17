const { pool } = require('../config/database');

const createUser = async ({ name, email, password, avatarUrl = null }) => {
  const { rows } = await pool.query(
    `INSERT INTO users (name, email, password, avatar_url)
     VALUES ($1, $2, $3, $4)
     RETURNING id, name, email, avatar_url, created_at`,
    [name, email, password, avatarUrl]
  );
  return rows[0];
};

const findUserByEmail = async (email) => {
  const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const findUserById = async (id) => {
  const { rows } = await pool.query(
    'SELECT id, name, email, avatar_url, created_at, password FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

const getAllUsers = async () => {
  const { rows } = await pool.query(
    'SELECT id, name, email, avatar_url, created_at FROM users ORDER BY created_at DESC'
  );
  return rows;
};

const deleteUser = async (id) => {
  const { rowCount } = await pool.query('DELETE FROM users WHERE id = $1', [id]);
  return rowCount > 0;
};

const updateUser = async (id, { name, password, avatarUrl }) => {
  const fields = [];
  const values = [];
  let index = 1;

  if (name !== undefined) {
    fields.push(`name = $${index++}`);
    values.push(name);
  }
  if (password !== undefined) {
    fields.push(`password = $${index++}`);
    values.push(password);
  }
  if (avatarUrl !== undefined) {
    fields.push(`avatar_url = $${index++}`);
    values.push(avatarUrl);
  }

  if (fields.length === 0) return null;

  values.push(id);

  const { rows } = await pool.query(
    `UPDATE users SET ${fields.join(', ')} WHERE id = $${index}
     RETURNING id, name, email, avatar_url, created_at`,
    values
  );
  return rows[0];
};

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  getAllUsers,
  deleteUser,
  updateUser,
};
