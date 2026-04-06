const knex = require('knex');
const config = require('../knexfile');
const { NODE_ENV } = require('./config/env');

const db = knex(config);

// 🚀 For SQLite in-memory, we can run migrations immediately during test setup
if (NODE_ENV === 'test') {
    console.log('🧪 [Database] Initializing in-memory SQLite for testing...');
} else {
    db.raw('SELECT 1').then(() => {
        console.log('✅ [Database] Connection established successfully');
    }).catch(err => {
        console.error('❌ [Database] Connection FAILED');
        console.error('Reason:', err.message);
    });
}

module.exports = db;
