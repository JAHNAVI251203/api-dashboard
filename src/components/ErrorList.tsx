import React from 'react';

interface Error {
    id: number;
    error_message: string;
    endpoint: string;
    method: string;
    occurrence_count: number;
    last_seen: string;
}

interface ErrorListProps {
    errors: Error[];
}

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => {
    return (
        <div style={{
            background: '#fff',
            borderRadius: '8px',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
            <h3>Top Errors (Last 24h)</h3>
            <div style={{ marginTop: '20px' }}>
                {errors.map(error => (
                    <div 
                        key={error.id}
                        style={{
                            borderBottom: '1px solid #eee',
                            padding: '15px 0'
                        }}
                    >
                        <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between',
                            marginBottom: '8px'
                        }}>
                            <span style={{ fontWeight: 'bold', color: '#ff4444' }}>
                                {error.occurrence_count}× {error.method} {error.endpoint}
                            </span>
                            <span style={{ color: '#999', fontSize: '12px' }}>
                                {new Date(error.last_seen).toLocaleString()}
                            </span>
                        </div>
                        <div style={{ color: '#666', fontSize: '14px' }}>
                            {error.error_message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};