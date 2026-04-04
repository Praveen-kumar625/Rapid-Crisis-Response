require('dotenv').config();

// Determine if we should use SSL (required for Railway/Render/AWS)
const isProduction = process.env.NODE_ENV === 'production' || !!process.env.DATABASE_URL;

// Deep Environment Variable Check
const dbUrl = process.env.DATABASE_URL;
const pgHost = process.env.PGHOST || process.env.DB_HOST;

if (dbUrl) {
    console.log('[Knex] ✅ Found DATABASE_URL. Connection secured.');
} else if (pgHost) {
    console.log('[Knex] ⚠️ DATABASE_URL missing, using individual PG variables.');
} else {
    console.error('[Knex] ❌ CRITICAL: No database environment variables found!');
    console.log('[Knex] Fallback to 127.0.0.1 (This will likely fail in production)');
}

const connection = dbUrl 
    ? { connectionString: dbUrl }
    : {
        host: pgHost || '127.0.0.1',
        port: Number(process.env.PGPORT || process.env.DB_PORT || 5432),
        database: process.env.PGDATABASE || process.env.DB_NAME,
        user: process.env.PGUSER || process.env.DB_USER,
        password: process.env.PGPASSWORD || process.env.DB_PASS,
    };

// Inject SSL configuration if in production environment
if (isProduction) {
    connection.ssl = { rejectUnauthorized: false };
}

module.exports = {
    client: 'pg',
    connection,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 60000, // Increased to 60s for slow DB wakeups
        idleTimeoutMillis: 30000,
    },
    migrations: {
        directory: __dirname + '/src/migrations',
        tableName: 'knex_migrations'
    }
};
