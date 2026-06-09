import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MetricsCard } from './MetricsCard';
import { Chart } from './Chart';
import { ErrorList } from './ErrorList';
import io from 'socket.io-client';


export const Dashboard: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [timeRange, setTimeRange] = useState('1 hour');
    const [socket, setSocket] = useState<any>(null);
    const [realtimeLogs, setRealtimeLogs] = useState<any[]>([]);


    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 30000); //refresh every 30s
        return () => clearInterval(interval);
    }, [timeRange]);

    useEffect(() => {
        const newSocket = io('http://localhost:8000');
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to WebSocket');
            newSocket.emit('subscribe', 'logs');
            newSocket.emit('subscribe', 'alerts');
        });

        newSocket.on('new-log', (data: any) => {
            setRealtimeLogs(prev => [data.log, ...prev].slice(0, 10));
        });

        newSocket.on('error-alert', (data: any) => {
            // Show notification
            alert(`Error Alert: ${data.error.error_message}`);
        });

        return () => {
            newSocket.close();
        };
    }, []);

    const fetchData = async () => {
        try {
            const response = await api.getDashboard(timeRange);
            setData(response.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch dashboard:', error);
        } finally {
            setLoading(false);
        }
    };
    
    if (loading) return <div>Loading...</div>;

    if (!data) {return <div>No data available.</div>;}

    const { overview } = data;

    return (
        <div style={{ padding: '20px', background: '#f5f5f5', minHeight: '100vh' }}>
            <h1>API Analytics Dashboard</h1>

            <div style={{ marginBottom: '20px' }}>
                <select
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                    style={{ padding: '8px', fontSize: '14px' }}
                >
                    <option value="1 hour">Last Hour</option>
                    <option value="6 hours">Last 6 Hours</option>
                    <option value="24 hours">Last 24 Hours</option>
                    <option value="7 days">Last 7 Days</option>
                </select>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px',
                marginBottom: '30px'
            }}>
                <MetricsCard
                    title="Total Requests"
                    value={overview.totalRequests.toLocaleString()}
                />
                <MetricsCard
                    title="Avg Response Time"
                    value={`${overview.avgResponseTime}ms`}
                    subtext={`Max: ${overview.maxResponseTime}ms`}
                />
                <MetricsCard
                    title="Error Rate"
                    value={`${overview.errorRate}%`}
                    trend={overview.errorRate > 5 ? 'up' : 'neutral'}
                />
                <MetricsCard
                    title="Success Rate"
                    value={`${overview.successRate}%`}
                    trend="up"
                />
            </div>

            {data.aiSummary && (
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3>AI Summary</h3>
                    <p>{data.aiSummary}</p>
                </div>
            )}

            <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr',
                gap: '20px',
                marginBottom: '20px'
            }}>
                <Chart
                    data={data.timeSeries}
                    type="area"
                    title="Request Volume Over Time"
                />
                <ErrorList errors={data.topErrors} />
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '20px'
            }}>
                {/* Add more charts for endpoint stats, status code distribution, etc. */}
            </div>

            <div style={{
                background: '#fff',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                maxHeight: '400px',
                overflow: 'auto'
            }}>
                <h3>Live Activity</h3>
                {realtimeLogs.map((log, i) => (
                    <div key={i} style={{
                        padding: '8px 0',
                        borderBottom: '1px solid #eee',
                        fontSize: '12px'
                    }}>
                        <span style={{
                            color: log.status_code >= 400 ? '#ff4444' : '#44ff44'
                        }}>
                            ●
                        </span> {log.method} {log.endpoint} - {log.status_code} ({log.response_time}ms)
                    </div>
                ))}
            </div>
        </div>
    );
};