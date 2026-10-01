import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;
const client = axios.create({ baseURL: API_BASE });

export const getSafeAuthMessage = (error: unknown, registering: boolean) => {
    if (!axios.isAxiosError(error)) {
        return registering ? 'Unable to create your account right now.' : 'Unable to sign in right now.';
    }

    switch (error.response?.status) {
        case 400:
            return registering
                ? 'Enter your name, a valid email, and a password with at least 8 characters, one capital letter, one number, and one special character.'
                : 'Enter your name, email, and password.';
        case 401:
            return 'The email or password is incorrect.';
        case 409:
            return 'An account with this email already exists. Please log in.';
        case 429:
            return 'Too many attempts. Please wait a moment and try again.';
        default:
            return registering ? 'Unable to create your account right now.' : 'Unable to sign in right now.';
    }
};

client.interceptors.request.use((config) => {
    const token = sessionStorage.getItem('apiToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

client.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && sessionStorage.getItem('apiToken')) {
            sessionStorage.removeItem('apiToken');
            window.dispatchEvent(new Event('auth-expired'));
        }
        return Promise.reject(error);
    }
);

export const api = {
    register: (name: string, email: string, password: string) =>
        client.post('/auth/register', { name, email, password }),

    login: (name: string, email: string, password: string) =>
        client.post('/auth/login', { name, email, password }),

    logout: () => client.post('/auth/logout'),

    getDashboard: (timeRange: string = '1 hour') => client.get('/dashboard', { params: { timeRange } }),

    searchEndpoints(search: string, timeRange: string, statusFilter: string) {
        return client.get(
            '/dashboard/search-endpoints',
            {
                params: { search, timeRange, statusFilter }
            }
        );
    },

    getAIAnalysis: () => client.get('/ai/analyze-errors'),

    getAnomalies: () => client.get('/ai/detect-anomalies')
};
