import React from 'react';
import {
    LineChart,
    Line,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ChartProps {
    data: any[];
    type?: 'line' | 'area';
    title: string;
}

export const Chart: React.FC<ChartProps> = ({ data, type = 'line', title }) => {
    const ChartComponent = type === 'line' ? LineChart : AreaChart;
    const DataComponent = type === 'line' ? Line : Area;
    
    return (
        <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3 style={{ marginBottom: '20px' }}>{title}</h3>
            <ResponsiveContainer width="100%" height={300}>
                <ChartComponent data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time_bucket" 
                        tickFormatter={(time) => new Date(time).toLocaleTimeString()}
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <DataComponent 
                        type="monotone" 
                        dataKey="request_count" 
                        stroke="#178d56" 
                        fill="#84d88c"
                        name="Requests"
                    />
                    <DataComponent 
                        type="monotone" 
                        dataKey="error_count" 
                        stroke="#ff4444" 
                        fill="#ff4444"
                        name="Errors"
                    />
                </ChartComponent>
            </ResponsiveContainer>
        </div>
    );
};