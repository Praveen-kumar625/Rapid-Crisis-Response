require('dotenv').config();
const { startScheduler } = require('./scheduler');
require('./processors'); // Starts the BullMQ worker
const { REDIS } = require('../config/env');

const redisConfig = REDIS.url ? REDIS.url : {
    host: REDIS.host,
    port: REDIS.port,
};

console.log('[Worker] Starting RCR background orchestration system...');
startScheduler(redisConfig);