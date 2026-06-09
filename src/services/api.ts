import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

export const api = {
    getDashboard: (timeRange: string = '1 hour') => 
        axios.get(`${API_BASE}/dashboard?timeRange=${timeRange}`),
    
    getMetrics: (timeRange: string = '1 hour') => 
        axios.get(`${API_BASE}/metrics?timeRange=${timeRange}`),
    
    getErrors: () => 
        axios.get(`${API_BASE}/errors`),
    
    getAIAnalysis: () => 
        axios.get(`${API_BASE}/ai/analyze-errors`),
    
    getAnomalies: () => 
        axios.get(`${API_BASE}/ai/detect-anomalies`)
};