const db = require('./db');
const bcrypt = require('bcryptjs');
const ensureDatabase = require('./ensureDatabase');

const initDatabase = async () => {
  await ensureDatabase();
  console.log('🔄 Checking database tables and running migrations...');

  try {
    // 1. Create users table
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('🛡️ Users table verified.');

    // 2. Create pages table
    await db.query(`
      CREATE TABLE IF NOT EXISTS pages (
        id INT AUTO_INCREMENT PRIMARY KEY,
        slug VARCHAR(100) NOT NULL UNIQUE,
        title VARCHAR(255) DEFAULT NULL,
        html_content LONGTEXT NOT NULL,
        views INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('📄 Pages table verified.');

    // 2b. Migrate pages table to support SEO & Custom Scripts
    try {
      await db.query(`ALTER TABLE pages ADD COLUMN meta_title VARCHAR(255) DEFAULT NULL`);
      console.log('➕ meta_title column verified.');
    } catch (e) {
      // column already exists, ignore
    }

    try {
      await db.query(`ALTER TABLE pages ADD COLUMN meta_description TEXT DEFAULT NULL`);
      console.log('➕ meta_description column verified.');
    } catch (e) {
      // column already exists, ignore
    }

    try {
      await db.query(`ALTER TABLE pages ADD COLUMN custom_css TEXT DEFAULT NULL`);
      console.log('➕ custom_css column verified.');
    } catch (e) {
      // column already exists, ignore
    }

    try {
      await db.query(`ALTER TABLE pages ADD COLUMN custom_js TEXT DEFAULT NULL`);
      console.log('➕ custom_js column verified.');
    } catch (e) {
      // column already exists, ignore
    }

    // 2c. Create leads table for contact form capture
    await db.query(`
      CREATE TABLE IF NOT EXISTS leads (
        id INT AUTO_INCREMENT PRIMARY KEY,
        page_id INT NOT NULL,
        name VARCHAR(255) DEFAULT NULL,
        email VARCHAR(255) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        message TEXT DEFAULT NULL,
        data JSON DEFAULT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (page_id) REFERENCES pages(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
    console.log('📥 Leads table verified.');

    // 3. Seed default admin user if no users exist
    const [users] = await db.query('SELECT id FROM users LIMIT 1');
    if (users.length === 0) {
      const defaultEmail = 'admin@noor.com';
      const defaultPassword = 'adminpassword';
      const passwordHash = await bcrypt.hash(defaultPassword, 10);

      await db.query(
        'INSERT INTO users (email, password_hash) VALUES (?, ?)',
        [defaultEmail, passwordHash]
      );

      console.log('\n========================================================================');
      console.log('🚀 DATABASE SEEDED WITH DEFAULT ADMIN CREDENTIALS:');
      console.log(`📧 Email:    ${defaultEmail}`);
      console.log(`🔑 Password: ${defaultPassword}`);
      console.log('⚠️  PLEASE CHANGE THIS PASSWORD AFTER YOUR FIRST LOGIN!');
      console.log('========================================================================\n');
    } else {
      console.log('✅ Database already seeded.');
    }

  } catch (err) {
    console.error('❌ Database migration failed:', err.message);
    throw err;
  }
};

module.exports = initDatabase;
