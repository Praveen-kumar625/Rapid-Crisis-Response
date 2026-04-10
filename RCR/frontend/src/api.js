// frontend/src/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

// Latency Tracking Interceptor
api.interceptors.request.use((config) => {
    config.metadata = { startTime: new Date() };
    return config;
});

api.interceptors.response.use(
    (response) => {
        response.config.metadata.endTime = new Date();
        response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
        return response;
    },
    (error) => {
        error.config.metadata.endTime = new Date();
        error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
        return Promise.reject(error);
    }
);

// Existing Request Interceptor
api.interceptors.request.use(async(config) => {
    if (process.env.REACT_APP_DEMO_MODE === 'true') {
        config.headers.Authorization = 'Bearer demo-token';
        return config;
    }

    const token = localStorage.getItem('google_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response Interceptor for Token Expiration (401 Error)
api.interceptors.response.use(
    (response) => response,
    async(error) => {
        if (error.response && error.response.status === 401) {
            // If unauthorized, clear token and redirect/reload if necessary
            // For now just clear it
            localStorage.removeItem('google_token');
        }
        return Promise.reject(error);
    }
);

export default api;