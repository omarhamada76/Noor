const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const buildBaseConfig = () => {
  const useSsl =
    process.env.DB_ENABLE_SSL === 'true' ||
    (process.env.DB_HOST || '').includes('tidbcloud.com');

  const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    port: Number(process.env.DB_PORT || 3306),
  };

  if (useSsl) {
    config.ssl = {
      minVersion: 'TLSv1.2',
      ca: process.env.DB_CA_PATH
        ? fs.readFileSync(process.env.DB_CA_PATH)
        : undefined,
    };
  }

  return config;
};

const ensureDatabase = async () => {
  const dbName = process.env.DB_NAME || 'noor_db';
  const connection = await mysql.createConnection(buildBaseConfig());

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    console.log(`✅ Database "${dbName}" is ready.`);
  } finally {
    await connection.end();
  }
};

module.exports = ensureDatabase;
