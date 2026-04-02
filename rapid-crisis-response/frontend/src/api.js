// frontend/src/api.js
import axios from 'axios';
import { auth } from './firebase';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

api.interceptors.request.use(async(config) => {
    if (process.env.REACT_APP_DEMO_MODE === 'true') {
        config.headers.Authorization = 'Bearer demo-token';
        return config;
    }

    if (auth.currentUser) {
        const token = await auth.currentUser.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async(error) => {
        const originalRequest = error.config;
        if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            try {
                const currentUser = auth.currentUser;
                if (currentUser) {
                    const freshToken = await currentUser.getIdToken(true);
                    originalRequest.headers.Authorization = `Bearer ${freshToken}`;
                    return api.request(originalRequest);
                }
            } catch (refreshError) {
                console.error('[API] Token refresh failed:', refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;