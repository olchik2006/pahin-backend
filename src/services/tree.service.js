const { pool } = require('../config/database');

const getAll = async ({ region, species_id, limit = 50, offset = 0 } = {}) => {
  let query = `
    SELECT t.*, u.full_name as planted_by,
           ts.name_ua as species_name, ts.image_url as species_image
    FROM trees t
    JOIN users u ON t.user_id = u.id
    JOIN tree_species ts ON t.species_id = ts.id
    WHERE t.status = 'approved'
  `;
  const params = [];

  if (region) {
    params.push(region);
    query += ` AND t.region = $${params.length}`;
  }
  if (species_id) {
    params.push(species_id);
    query += ` AND t.species_id = $${params.length}`;
  }

  params.push(limit, offset);
  query += ` ORDER BY t.planted_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`;

  const result = await pool.query(query, params);
  return result.rows;
};

const findById = async (id) => {
  const result = await pool.query(
    `SELECT t.*, u.full_name as planted_by, ts.name_ua as species_name
     FROM trees t
     JOIN users u ON t.user_id = u.id
     JOIN tree_species ts ON t.species_id = ts.id
     WHERE t.id = $1`,
    [id]
  );
  return result.rows[0] || null;
};

const getByUserId = async (user_id) => {
  const result = await pool.query(
    `SELECT t.*, ts.name_ua as species_name, ts.image_url as species_image
     FROM trees t
     JOIN tree_species ts ON t.species_id = ts.id
     WHERE t.user_id = $1
     ORDER BY t.planted_at DESC`,
    [user_id]
  );
  return result.rows;
};

const create = async ({
  user_id,
  species_id,
  latitude,
  longitude,
  location_name,
  region,
  personal_message,
}) => {
  const result = await pool.query(
    `INSERT INTO trees (user_id, species_id, latitude, longitude, location_name, region, personal_message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, species_id, latitude, longitude, location_name, region, personal_message]
  );
  return result.rows[0];
};

const remove = async (id, user_id) => {
  const result = await pool.query('DELETE FROM trees WHERE id = $1 AND user_id = $2 RETURNING id', [
    id,
    user_id,
  ]);
  return result.rows[0] || null;
};

const getAllSpecies = async () => {
  const result = await pool.query('SELECT * FROM tree_species ORDER BY name_ua');
  return result.rows;
};

const getTotalCount = async () => {
  const result = await pool.query("SELECT COUNT(*) as total FROM trees WHERE status = 'approved'");
  return parseInt(result.rows[0].total);
};

module.exports = { getAll, findById, getByUserId, create, remove, getAllSpecies, getTotalCount };
