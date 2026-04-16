import { io } from 'socket.io-client';

let socket = null;

/**
 * Returns a singleton Socket.io client.
 * JWT (if any) is sent via the `auth` field.
 */
export async function getSocket() {
    if (socket) return socket;

    const token = localStorage.getItem('google_token');

    socket = io(process.env.REACT_APP_SOCKET_URL, {
        path: '/crisis',
        transports: ['websocket'],
        auth: { token },
    });

    socket.on('connect_error', (err) => console.error('WS error', err));

    return socket;
}

/**
 * OBJECTIVE 2: Fail-safe Socket Emitter with Timeout
 * Emits an event and waits for acknowledgment with a timeout.
 */
export async function emitWithTimeout(event, payload, timeout = 5000) {
    const s = await getSocket();
    
    return new Promise((resolve, reject) => {
        let timer = setTimeout(() => {
            reject(new Error(`TIMEOUT:${event}`));
        }, timeout);

        s.emit(event, payload, (response) => {
            clearTimeout(timer);
            if (response && response.status === 'error') {
                reject(new Error(response.message || 'SOCKET_ERROR'));
            } else {
                resolve(response);
            }
        });
    });
}

// FIXED: Export function to update socket token on refresh
export const updateSocketToken = (newToken) => {
    if (socket) {
        console.log('[Socket] Updating auth token and reconnecting...');
        socket.auth.token = newToken;
        socket.disconnect().connect();
    }
};

export const joinHotelRoom = async (hotelId) => {
    const s = await getSocket();
    if (hotelId) {
        s.emit('join-hotel', hotelId);
    }
};