const Redis = require('ioredis');
const { REDIS } = require('../config/env');

const redisConfig = REDIS.url ? REDIS.url : {
    host: REDIS.host,
    port: REDIS.port,
};

const redisClient = new Redis(redisConfig, {
    retryStrategy: (times) => Math.min(times * 50, 2000),
});

exports.publish = async(channel, payload) => {
    await redisClient.publish(channel, JSON.stringify(payload));
};

exports.publishToRoles = async(roles, payload) => {
    if (!Array.isArray(roles)) return;
    await Promise.all(
        roles.map((role) => redisClient.publish(role, JSON.stringify(payload)))
    );
};

exports.getClient = () => redisClient;