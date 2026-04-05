const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const mysql = require('mysql2/promise');

const {
  MYSQL_HOST = '127.0.0.1',
  MYSQL_PORT = '3306',
  MYSQL_USER,
  MYSQL_PASSWORD,
  MYSQL_DATABASE,
} = process.env;

// ❗ FIX 1: Remove crash (keep warning only)
if (!MYSQL_USER || !MYSQL_DATABASE) {
  console.error(
    'Missing required env: MYSQL_USER and MYSQL_DATABASE must be set.'
  );
  // ❌ removed process.exit(1)
}

const pool = mysql.createPool({
  host: MYSQL_HOST,
  port: Number(MYSQL_PORT) || 3306,
  user: MYSQL_USER,
  password: MYSQL_PASSWORD ?? '',
  database: MYSQL_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// ❗ FIX 2: Prevent crash on DB error
pool.on('error', (err) => {
  console.error('MySQL pool error:', err.message);

  if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'ECONNRESET') {
    return;
  }

  if (err.fatal) {
    console.error('Fatal DB error, but server will continue running.');
    // ❌ removed process.exit(1)
  }
});

module.exports = pool;