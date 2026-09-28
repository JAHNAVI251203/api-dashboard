import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { DataSource } from '../types/dashboard';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';

interface AIInsightsProps {
    dataSource?: DataSource;
}

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

export const AIInsights: React.FC<AIInsightsProps> = ({ dataSource = 'live' }) => {
    const [errorAnalysis, setErrorAnalysis] = useState<ErrorAnalysis | null>(null);
    const [anomalies, setAnomalies] = useState<Anomalies | null>(null);
    const [loading, setLoading] = useState(true);
    const [requestError, setRequestError] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchAIData = async () => {
            setLoading(true);
            setRequestError(false);

            try {
                const [errorsRes, anomaliesRes] = await Promise.all([
                    api.getAIAnalysis(dataSource),
                    api.getAnomalies(dataSource),
                ]);

                if (!active) return;
                setErrorAnalysis(errorsRes.data.data);
                setAnomalies(anomaliesRes.data.data);
            } catch {
                if (active) setRequestError(true);
            } finally {
                if (active) setLoading(false);
            }
        };

        void fetchAIData();
        const interval = window.setInterval(fetchAIData, 300000);
        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, [dataSource]);

    if (loading) {
        return (
            <div className="grid gap-4 lg:grid-cols-2" aria-label="Loading AI insights">
                <div className="border border-border p-4"><Skeleton className="h-5 w-40" /><div className="mt-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-3/4" /></div></div>
                <div className="border border-border p-4"><Skeleton className="h-5 w-32" /><div className="mt-4 space-y-3"><Skeleton className="h-4 w-full" /><Skeleton className="h-4 w-2/3" /></div></div>
            </div>
        );
    }

    if (requestError) {
        return (
            <Alert variant="warning">
                <AlertTitle>AI insights unavailable</AlertTitle>
                <AlertDescription>Core dashboard analytics remain available while AI insights recover.</AlertDescription>
            </Alert>
        );
    }

    return (
        <div className="grid items-stretch gap-4 lg:grid-cols-2">
            {errorAnalysis?.severity && (
                <section className="flex h-full flex-col border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-semibold">AI Error Analysis</h3>
                        </div>
                        <Badge variant={getSeverityVariant(errorAnalysis.severity)}>{errorAnalysis.severity.toUpperCase()}</Badge>
                    </div>
                    <div className="mt-4 grid flex-1 content-start gap-3 text-sm sm:grid-cols-2">
                        <div className="border border-border bg-muted p-3">
                            <p className="font-medium">Root cause</p>
                            <p className="mt-2 text-muted-foreground">{errorAnalysis.rootCause ?? 'Not available'}</p>
                        </div>
                        <div className="border border-border bg-muted p-3">
                            <p className="font-medium">Suggested fix</p>
                            <p className="mt-2 text-muted-foreground">{errorAnalysis.suggestedFix ?? 'Not available'}</p>
                        </div>
                        {errorAnalysis.affectedEndpoints && errorAnalysis.affectedEndpoints.length > 0 && (
                            <div className="border border-border bg-muted p-3 sm:col-span-2">
                                <p className="font-medium">Affected endpoints</p>
                                <ul className="mt-1 list-inside list-disc text-muted-foreground">
                                    {errorAnalysis.affectedEndpoints.map(endpoint => <li key={endpoint}>{endpoint}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                </section>
            )}

            {errorAnalysis?.message && !errorAnalysis.severity && (
                <Alert className="lg:col-span-2">
                    <AlertTitle>AI Error Analysis</AlertTitle>
                    <AlertDescription>No monitored API errors are available for analysis.</AlertDescription>
                </Alert>
            )}

            {anomalies?.hasAnomaly && anomalies.anomalyType && anomalies.anomalyType !== 'none' && (
                <section className="flex h-full flex-col border border-border bg-card p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h3 className="font-semibold">Anomaly Detection</h3>
                        </div>
                        <Badge variant="warning">{(anomalies.severity ?? 'unknown').toUpperCase()}</Badge>
                    </div>
                    <div className="mt-4 grid flex-1 content-start gap-3 text-sm sm:grid-cols-2">
                        <p className="border border-border bg-muted p-3"><span className="font-medium">Type:</span><br />{anomalies.anomalyType.replace('_', ' ').toUpperCase()}</p>
                        <p className="border border-border bg-muted p-3"><span className="font-medium">Severity:</span><br />{(anomalies.severity ?? 'unknown').toUpperCase()}</p>
                        <p className="border border-border bg-muted p-3 sm:col-span-2"><span className="font-medium">Explanation:</span><br />{anomalies.explanation ?? 'Not available'}</p>
                        <p className="border border-border bg-muted p-3 sm:col-span-2"><span className="font-medium">Recommendation:</span><br />{anomalies.recommendation ?? 'Review recent API traffic.'}</p>
                    </div>
                </section>
            )}

            {!errorAnalysis?.severity && !errorAnalysis?.message && !anomalies?.hasAnomaly && (
                <p className="text-sm text-muted-foreground lg:col-span-2">No AI insights are available for this data source.</p>
            )}
        </div>
    );
};

const getSeverityVariant = (severity: string): 'default' | 'destructive' | 'warning' | 'success' => {
    if (severity === 'critical' || severity === 'high') return 'destructive';
    if (severity === 'medium') return 'warning';
    return 'success';
};
