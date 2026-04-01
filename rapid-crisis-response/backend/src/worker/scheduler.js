const cron = require('node-cron');
const { fetchUSGS } = require('./feeds/usgs');
const SocketService = require('../services/socket.service');

function startScheduler(redisConfig) {
    const redis = new(require('ioredis'))(redisConfig);

    cron.schedule('*/1 * * * *', async () => {
        try {
            const incidents = await fetchUSGS();

            for (const inc of incidents) {
                await redis.publish('incidents', JSON.stringify({
                    type: 'created',
                    incident: inc
                }));
            }

            console.log(`✅ Worker published ${incidents.length} USGS incidents`);
        } catch (err) {
            console.error('🚨 Worker error:', err);
        }
    });

    console.log('🕒 Worker scheduler started (runs every minute)');
}

module.exports = { startScheduler };