const { pool } = require('../config/database');

const createTree = async ({ userId, speciesId, latitude, longitude, locationName, message }) => {
  const { rows } = await pool.query(
    `INSERT INTO trees (user_id, species_id, latitude, longitude, location_name, user_description)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING
       id,
       user_id      AS "userId",
       species_id   AS "speciesId",
       latitude,
       longitude,
       location_name AS "locationName",
       user_description AS "message",
       planted_at   AS "createdAt"`,
    [userId, speciesId, latitude, longitude, locationName, message]
  );
  return rows[0];
};

const getAllTrees = async ({ category, region } = {}) => {
  let query = `
    SELECT
      t.id,
      t.user_id          AS "userId",
      u.name             AS "userName",
      s.name_ukr         AS "speciesName",
      s.category         AS "speciesCategory",
      t.latitude,
      t.longitude,
      t.location_name    AS "locationName",
      t.user_description AS "message",
      t.planted_at       AS "createdAt"
    FROM trees t
    JOIN users u        ON u.id = t.user_id
    JOIN tree_species s ON s.id = t.species_id
    WHERE 1=1
  `;

  const values = [];

  if (category) {
    values.push(category);
    query += ` AND s.category = $${values.length}`;
  }

  if (region) {
    values.push(`%${region}%`);
    query += ` AND t.location_name ILIKE $${values.length}`;
  }

  query += ' ORDER BY t.planted_at DESC';

  const { rows } = await pool.query(query, values);
  return rows;
};

const findTreeById = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       t.id,
       t.user_id          AS "userId",
       u.name             AS "userName",
       s.name_ukr         AS "speciesName",
       s.category         AS "speciesCategory",
       t.latitude,
       t.longitude,
       t.location_name    AS "locationName",
       t.user_description AS "message",
       t.planted_at       AS "createdAt"
     FROM trees t
     JOIN users u        ON u.id = t.user_id
     JOIN tree_species s ON s.id = t.species_id
     WHERE t.id = $1`,
    [id]
  );
  return rows[0];
};

const getTreesByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
       t.id,
       t.user_id          AS "userId",
       u.name             AS "userName",
       s.name_ukr         AS "speciesName",
       s.category         AS "speciesCategory",
       t.latitude,
       t.longitude,
       t.location_name    AS "locationName",
       t.user_description AS "message",
       t.planted_at       AS "createdAt"
     FROM trees t
     JOIN users u        ON u.id = t.user_id
     JOIN tree_species s ON s.id = t.species_id
     WHERE t.user_id = $1
     ORDER BY t.planted_at DESC`,
    [userId]
  );
  return rows;
};

module.exports = { createTree, getAllTrees, findTreeById, getTreesByUserId };
