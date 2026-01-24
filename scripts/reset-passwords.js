/**
 * Password Reset Script
 * Run: node scripts/reset-passwords.js
 */

const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'data', 'maianhdao.db');
const db = new Database(dbPath);

// Generate secure passwords for all users
const users = db.prepare('SELECT id, username, role FROM admin_users').all();

console.log('\n🔐 RESETTING ALL ADMIN PASSWORDS\n');
console.log('='.repeat(60));

const newPasswords = [];

for (const user of users) {
    // Generate strong random password: 12 chars, mixed case, numbers, special
    const password = crypto.randomBytes(6).toString('base64').replace(/[+/=]/g, 'x').slice(0, 12) + '@1A';
    const hash = bcrypt.hashSync(password, 12);
    
    db.prepare('UPDATE admin_users SET password = ? WHERE id = ?').run(hash, user.id);
    
    newPasswords.push({ username: user.username, role: user.role, password });
    
    console.log(`✅ ${user.username} (${user.role})`);
    console.log(`   New Password: ${password}`);
    console.log('');
}

console.log('='.repeat(60));
console.log('\n⚠️  SAVE THESE PASSWORDS! They will not be shown again.\n');
console.log('📋 Login at: https://maianhdao.lamdong.vn/admin/login\n');

db.close();
