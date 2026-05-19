if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
}

const initDatabase = require('../config/initDb');

initDatabase()
  .then(() => {
    console.log('✅ Migration complete.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  });
