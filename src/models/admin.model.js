const { pool } = require('../config/database');

const getPendingTrees = async () => {
  const { rows } = await pool.query(
    `SELECT t.*, u.name AS user_name, u.email AS user_email,
            ts.name_ukr AS species_name
     FROM trees t
     JOIN users u ON t.user_id = u.id
     JOIN tree_species ts ON t.species_id = ts.id
     WHERE t.status = 'pending'
     ORDER BY t.planted_at DESC`
  );
  return rows;
};

const updateTreeStatus = async (id, status) => {
  const { rows } = await pool.query(`UPDATE trees SET status = $1 WHERE id = $2 RETURNING *`, [
    status,
    id,
  ]);
  return rows[0];
};

module.exports = { getPendingTrees, updateTreeStatus };
