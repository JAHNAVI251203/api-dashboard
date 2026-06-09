import React from 'react';

interface MetricsCardProps {
    title: string;
    value: string | number;
    subtext?: string;
    trend?: 'up' | 'down' | 'neutral';
}

export const MetricsCard: React.FC<MetricsCardProps> = ({ 
    title, 
    value, 
    subtext,
    trend = 'neutral'
}) => {
    return (
        <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <div style={{ color: '#666', fontSize: '14px', marginBottom: '8px' }}>
                {title}
            </div>
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '8px' }}>
                {value}
            </div>
            {subtext && (
                <div style={{ color: '#999', fontSize: '12px' }}>
                    {subtext}
                </div>
            )}
        </div>
    );
};