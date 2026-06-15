import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

interface ErrorAnalysis {
    severity?: string;
    rootCause?: string;
    suggestedFix?: string;
    affectedEndpoints?: string[];
    message?: string;
}

interface Anomalies {
    hasAnomaly?: boolean;
    anomalyType?: string;
    severity?: string;
    explanation?: string;
    recommendation?: string;
}

export const AIInsights: React.FC = () => {
    const [errorAnalysis, setErrorAnalysis] = useState<ErrorAnalysis | null>(null);
    const [anomalies, setAnomalies] = useState<Anomalies | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAIData();
        const interval = setInterval(fetchAIData, 300000); // 5 minutes
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
        } catch (error) {
            console.error('Failed to fetch AI insights:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading AI insights...</div>;

    console.log('Error Analysis:', errorAnalysis);
    console.log('Anomalies:', anomalies);

    return (
        <div className="fade-in" style={{ display: 'grid', gap: '20px' }}>

            {/* Full AI Analysis */}
            {errorAnalysis?.severity && (
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3>AI Error Analysis</h3>

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
                            <strong>Root Cause:</strong>{' '}
                            {errorAnalysis.rootCause ?? 'Not available'}
                        </div>

                        <div style={{ marginBottom: '15px' }}>
                            <strong>Suggested Fix:</strong>

                            <p style={{
                                background: '#f8f9fa',
                                padding: '12px',
                                borderRadius: '4px',
                                marginTop: '8px'
                            }}>
                                {errorAnalysis.suggestedFix ?? 'Not available'}
                            </p>
                        </div>

                        {errorAnalysis.affectedEndpoints &&
                            errorAnalysis.affectedEndpoints.length > 0 && (
                                <div>
                                    <strong>Affected Endpoints:</strong>

                                    <ul>
                                        {errorAnalysis.affectedEndpoints.map(
                                            (ep, i) => (
                                                <li key={i}>{ep}</li>
                                            )
                                        )}
                                    </ul>
                                </div>
                            )}
                    </div>
                </div>
            )}

            {/* No errors case */}
            {errorAnalysis?.message && (
                <div style={{
                    background: '#fff',
                    borderRadius: '8px',
                    padding: '20px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}>
                    <h3>AI Error Analysis</h3>
                    <p>{errorAnalysis.message}</p>
                </div>
            )}

            {/* Anomaly Detection */}
            {anomalies?.hasAnomaly &&
                anomalies.anomalyType &&
                anomalies.anomalyType !== 'none' && (
                    <div style={{
                        background: '#fff3cd',
                        border: '2px solid #ffc107',
                        borderRadius: '8px',
                        padding: '20px'
                    }}>
                        <h3>Anomaly Detected</h3>

                        <div style={{ marginTop: '15px' }}>
                            <div style={{ marginBottom: '10px' }}>
                                <strong>Type:</strong>{' '}
                                {anomalies.anomalyType
                                    .replace('_', ' ')
                                    .toUpperCase()}
                            </div>

                            <div style={{ marginBottom: '10px' }}>
                                <strong>Severity:</strong>{' '}
                                {(anomalies.severity ?? 'unknown').toUpperCase()}
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