const bcrypt = require('bcryptjs');

// Get arguments
const args = process.argv.slice(2);
const email = args[0];
const password = args[1];

if (!email || !password) {
  console.log('\n❌ Error: Please provide both an email and a password.');
  console.log('Usage: node scripts/hashPassword.js <email> <password>');
  console.log('Example: node scripts/hashPassword.js admin@noor.com mysecurepassword\n');
  process.exit(1);
}

const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) {
    console.error('❌ Error hashing password:', err);
    process.exit(1);
  }

  console.log('\n========================================================================');
  console.log('🔑 PASSWORD HASHING COMPLETE');
  console.log('========================================================================');
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log(`Hash:     ${hash}`);
  console.log('------------------------------------------------------------------------');
  console.log('💾 SQL INSERT STATEMENT (Run this manually in your MySQL Database):');
  console.log(`INSERT INTO users (email, password_hash) VALUES ('${email}', '${hash}');`);
  console.log('========================================================================\n');
});
