const mysql = require('mysql2/promise');

// Use Railway full DB URL
const pool = mysql.createPool(process.env.MYSQL_URL);

// Optional: test connection (helps debug)
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ MySQL connected successfully");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err.message);
  }
})();

module.exports = pool;