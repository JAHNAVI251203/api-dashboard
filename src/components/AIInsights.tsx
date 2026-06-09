import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export const AIInsights: React.FC = () => {
    const [errorAnalysis, setErrorAnalysis] = useState<any>(null);
    const [anomalies, setAnomalies] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        fetchAIData();
        const interval = setInterval(fetchAIData, 300000); // Every 5 minutes
        return () => clearInterval(interval);
    }, []);
    
    const fetchAIData = async () => {
        try {
            const [errorsRes, anomaliesRes] = await Promise.all([
                api.getAIAnalysis(),
                api.getAnomalies()
            ]);
            
            setErrorAnalysis(errorsRes.data.data);
            setAnomalies(anomaliesRes.data.data);
            setLoading(false);
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
        }
    };
    
    if (loading) return <div>Loading AI insights...</div>;
    
    return (
        <div style={{ display: 'grid', gap: '20px' }}>
            {/* Error Analysis */}
            {errorAnalysis && (
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3>🤖 AI Error Analysis</h3>
                    <div style={{ marginTop: '15px' }}>
                        <div style={{
                            background: getSeverityColor(errorAnalysis.severity),
                            color: '#fff',
                            padding: '8px 12px',
                            borderRadius: '4px',
                            display: 'inline-block',
                            marginBottom: '15px'
                        }}>
                            {errorAnalysis.severity.toUpperCase()} SEVERITY
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Root Cause:</strong> {errorAnalysis.rootCause}
                        </div>
                        
                        <div style={{ marginBottom: '15px' }}>
                            <strong>Suggested Fix:</strong>
                            <p style={{ 
                                background: '#f8f9fa', 
                                padding: '12px', 
                                borderRadius: '4px',
                                marginTop: '8px'
                            }}>
                                {errorAnalysis.suggestedFix}
                            </p>
                        </div>
                        
                        {errorAnalysis.affectedEndpoints && (
                            <div>
                                <strong>Affected Endpoints:</strong>
                                <ul>
                                    {errorAnalysis.affectedEndpoints.map((ep: string, i: number) => (
                                        <li key={i}>{ep}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Anomaly Detection */}
            {anomalies && anomalies.hasAnomaly && (
                <div style={{
                    background: '#fff3cd',
                    border: '2px solid #ffc107',
                    borderRadius: '8px',
                    padding: '20px'
                }}>
                    <h3>⚠️ Anomaly Detected</h3>
                    <div style={{ marginTop: '15px' }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Type:</strong> {anomalies.anomalyType.replace('_', ' ').toUpperCase()}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Severity:</strong> {anomalies.severity.toUpperCase()}
                        </div>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>Explanation:</strong>
                            <p>{anomalies.explanation}</p>
                        </div>
                        <div>
                            <strong>Recommendation:</strong>
                            <p style={{ 
                                background: '#fff', 
                                padding: '12px', 
                                borderRadius: '4px',
                                border: '1px solid #ffc107'
                            }}>
                                {anomalies.recommendation}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

function getSeverityColor(severity: string): string {
    const colors: Record<string, string> = {
        low: '#28a745',
        medium: '#ffc107',
        high: '#fd7e14',
        critical: '#dc3545'
    };
    return colors[severity] || '#6c757d';
}