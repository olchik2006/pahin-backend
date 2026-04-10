const { pool } = require('../config/database');

const getAllSpecies = async () => {
  const { rows } = await pool.query(
    `SELECT
       id,
       name_ukr AS name,
       latin_name AS "latinName",
       category,
       description,
       soil,
       weather,
       region,
       distance,
       image_url AS "imageUrl"
     FROM tree_species
     ORDER BY category, name_ukr`
  );
  return rows;
};

const findSpeciesById = async (id) => {
  const { rows } = await pool.query('SELECT * FROM tree_species WHERE id = $1', [id]);
  return rows[0];
};

module.exports = { getAllSpecies, findSpeciesById };
