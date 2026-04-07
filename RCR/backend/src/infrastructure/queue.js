const { Queue } = require('bullmq');
const { REDIS, NODE_ENV } = require('../config/env');

const connection = REDIS.url ? REDIS.url : {
    host: REDIS.host,
    port: REDIS.port
};

// 🚨 FIXED: In test mode, we might want to skip real Redis connection or use a mock.
// For now, we will wrap the Queue initialization to prevent crashing the whole test suite.
let incidentQueue;

try {
    incidentQueue = new Queue('incident-tasks', { 
        connection,
        defaultJobOptions: {
            attempts: 3,
            backoff: {
                type: 'exponential',
                delay: 2000
            },
            removeOnComplete: true,
            removeOnFail: false
        }
    });

    // 🚨 RESILIENCE: Prevent tests from hanging on Redis connection errors
    if (NODE_ENV === 'test') {
        incidentQueue.on('error', (err) => {
            console.warn('🧪 [Queue] Redis connection error ignored in TEST mode.');
        });
    }
} catch (err) {
    if (NODE_ENV === 'test') {
        console.warn('🧪 [Queue] Could not initialize BullMQ in TEST mode. Using mock queue.');
        incidentQueue = {
            add: async () => ({ id: 'mock-job-id' }),
            on: () => {}
        };
    } else {
        throw err;
    }
}

module.exports = { incidentQueue, connection };
