require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production' || !!process.env.RAILWAY_ENVIRONMENT || !!process.env.DATABASE_URL;

const connection = process.env.DATABASE_URL 
    ? { 
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false
      }
    : {
        host: process.env.DB_HOST || process.env.PGHOST || '127.0.0.1',
        port: Number(process.env.DB_PORT || process.env.PGPORT || 5432),
        database: process.env.DB_NAME || process.env.PGDATABASE || 'rcr_db',
        user: process.env.DB_USER || process.env.PGUSER || 'postgres',
        password: process.env.DB_PASS || process.env.PGPASSWORD || 'postgres',
        ssl: isProduction ? { rejectUnauthorized: false } : false
    };

module.exports = {
    client: 'pg',
    connection,
    pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 60000,
    },
    migrations: {
        directory: __dirname + '/src/migrations',
        tableName: 'knex_migrations'
    }
};
