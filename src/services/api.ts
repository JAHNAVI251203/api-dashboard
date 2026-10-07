import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL;
const client = axios.create({ baseURL: API_BASE });

export const api = {
    getDashboard: (timeRange: string = '1 hour') => client.get('/dashboard', { params: { timeRange } }),

    runDemoScenario: () => client.post('/demo/run'),

    getAIAnalysis: () => client.get('/ai/analyze-errors'),

    getAnomalies: () => client.get('/ai/detect-anomalies')
};
