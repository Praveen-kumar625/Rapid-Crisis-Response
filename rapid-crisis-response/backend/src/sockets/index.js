// src/sockets/index.js
const { Server } = require('socket.io');
const Redis = require('ioredis');
const { REDIS } = require('../config/env');
const { startAlertListener } = require('../services/alert.service'); // <‑‑ NEW

let ioInstance = null;
const redisClient = new Redis({
    host: REDIS.host,
    port: REDIS.port,
});

function initSocket(httpServer) {
    const allowedOrigins = (process.env.SOCKET_ALLOWED_ORIGINS || 'http://localhost:3000').split(',');

    const io = new Server(httpServer, {
        cors: {
            origin: (origin, callback) => {
                if (!origin || allowedOrigins.includes(origin)) {
                    return callback(null, true);
                }
                return callback(new Error('Forbidden by CORS'));
            },
            methods: ['GET', 'POST'],
        },
        path: '/crisis',
    });

    // -----------------------------------------------------------------
    // Existing WS logic (rooms, connection logging, Redis → WS)
    // -----------------------------------------------------------------
    io.on('connection', (socket) => {
        console.log(`🔌 Socket ${socket.id} connected`);
        socket.join('global');

        socket.on('join-incident', (incId) => socket.join(`incident-${incId}`));
        socket.on('leave-incident', (incId) => socket.leave(`incident-${incId}`));
    });

    const subscriber = redisClient.duplicate();
    subscriber.subscribe('incidents', (err) => {
        if (err) console.error('Redis subscribe error', err);
    });
    subscriber.on('message', (_chan, msg) => {
        const payload = JSON.parse(msg);
        io.to('global').emit(`incident.${payload.type}`, payload);
    });

    // -----------------------------------------------------------------
    // NEW – start the Twilio SMS alert listener (runs in the same process)
    // -----------------------------------------------------------------
    startAlertListener();

    ioInstance = io;
    return io;
}

module.exports = { initSocket, ioInstance, redisClient };