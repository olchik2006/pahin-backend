const { pool } = require('../config/database');

const getCertificatesByUserId = async (userId) => {
  const { rows } = await pool.query(
    `SELECT
       c.id,
       c.user_id AS "userId",
       c.tree_id AS "treeId",
       c.planting_date AS "plantingDate",
       c.planting_place AS "plantingPlace",
       c.pdf_url AS "pdfUrl"
     FROM certificates c
     WHERE c.user_id = $1
     ORDER BY c.planting_date DESC`,
    [userId]
  );
  return rows;
};

module.exports = { getCertificatesByUserId };
