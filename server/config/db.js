const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const useSsl =
  process.env.DB_ENABLE_SSL === 'true' ||
  (process.env.DB_HOST || '').includes('tidbcloud.com');

const poolConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'noor_db',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
};

if (useSsl) {
  poolConfig.ssl = {
    minVersion: 'TLSv1.2',
    ca: process.env.DB_CA_PATH
      ? fs.readFileSync(process.env.DB_CA_PATH)
      : undefined,
  };
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
