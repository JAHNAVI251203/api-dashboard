import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;

export const api = {
    getDashboard: (timeRange: string = '1 hour') =>
        axios.get(`${API_BASE}/dashboard?timeRange=${timeRange}`),

    getMetrics: (timeRange: string = '1 hour') =>
        axios.get(`${API_BASE}/metrics?timeRange=${timeRange}`),

    getErrors: () =>
        axios.get(`${API_BASE}/errors`),

    searchEndpoints(search: string, timeRange: string, statusFilter: string) {
        return axios.get(
            `${API_BASE}/dashboard/search-endpoints`,
            {
                params: { search, timeRange, statusFilter }
            }
        );
    },

    getAIAnalysis: () =>
        axios.get(`${API_BASE}/ai/analyze-errors`),

    getAnomalies: () =>
        axios.get(`${API_BASE}/ai/detect-anomalies`)
};