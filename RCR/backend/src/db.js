const knex = require('knex');
const config = require('../knexfile');
const { NODE_ENV } = require('./config/env');

const db = knex(config);

// 🚨 FIXED: Skip validation query in test mode to prevent CI failures when DB is absent
if (NODE_ENV !== 'test') {
    db.raw('SELECT 1').then(() => {
        console.log('✅ [Database] Connection established successfully');
    }).catch(err => {
        console.error('❌ [Database] Connection FAILED');
        console.error('Reason:', err.message);
        console.error('Configuration used:', JSON.stringify({
            client: config.client,
            host: config.connection.host || 'from-url',
            database: config.connection.database || 'from-url',
            user: config.connection.user || 'from-url'
        }));
    });
} else {
    console.log('🧪 [Database] Running in TEST mode. Skipping connection validation.');
}

module.exports = db;
