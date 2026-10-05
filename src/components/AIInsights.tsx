import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Skeleton } from './ui/skeleton';

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
    const [requestError, setRequestError] = useState(false);

    useEffect(() => {
        let active = true;

        const fetchAIData = async () => {
            setLoading(true);
            setRequestError(false);

            try {
                const [errorsRes, anomaliesRes] = await Promise.all([
                    api.getAIAnalysis(),
                    api.getAnomalies(),
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
    }, []);

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
                    <h3 className="font-semibold">Error Analysis</h3>
                    <div className="mt-4 grid flex-1 content-start gap-3 text-sm sm:grid-cols-2">
                        <div className="border border-border bg-muted p-3">
                            <p className="font-medium">Severity:</p>
                            <p className={`mt-2 font-semibold ${severityTextClass(errorAnalysis.severity)}`}>{errorAnalysis.severity.toUpperCase()}</p>
                        </div>
                        <div className="border border-border bg-muted p-3">
                            <p className="font-medium">Root cause:</p>
                            <p className="mt-2 text-muted-foreground">{errorAnalysis.rootCause ?? 'Not available'}</p>
                        </div>
                        {errorAnalysis.affectedEndpoints && errorAnalysis.affectedEndpoints.length > 0 && (
                            <div className="border border-border bg-muted p-3">
                                <p className="font-medium">Affected endpoints:</p>
                                <ul className="mt-1 list-inside list-disc text-muted-foreground">
                                    {errorAnalysis.affectedEndpoints.map(endpoint => <li key={endpoint}>{endpoint}</li>)}
                                </ul>
                            </div>
                        )}
                        <div className="border border-border bg-muted p-3 sm:col-span-2">
                            <p className="font-medium">Suggested fix:</p>
                            <p className="mt-2 text-muted-foreground">{errorAnalysis.suggestedFix ?? 'Not available'}</p>
                        </div>
                    </div>
                </section>
            )}

            {!errorAnalysis?.severity && (
                <section className="flex h-full flex-col border border-border bg-card p-4">
                    <h3 className="font-semibold">Error Analysis</h3>
                    <p className="mt-4 text-sm text-muted-foreground">{errorAnalysis?.message ?? 'No monitored API errors are available for analysis.'}</p>
                </section>
            )}

            {anomalies?.hasAnomaly && anomalies.anomalyType && anomalies.anomalyType !== 'none' && (
                <section className="flex h-full flex-col border border-border bg-card p-4">
                    <h3 className="font-semibold">Anomaly Detection</h3>
                    <div className="mt-4 grid flex-1 content-start gap-3 text-sm sm:grid-cols-2">
                        <p className="border border-border bg-muted p-3 text-muted-foreground"><span className="font-medium text-foreground">Type:</span><br />{anomalies.anomalyType.replace('_', ' ').toUpperCase()}</p>
                        <p className="border border-border bg-muted p-3 text-muted-foreground"><span className="font-medium text-foreground">Severity:</span><br /><span className={`font-semibold ${severityTextClass(anomalies.severity)}`}>{(anomalies.severity ?? 'unknown').toUpperCase()}</span></p>
                        <p className="border border-border bg-muted p-3 text-muted-foreground sm:col-span-2"><span className="font-medium text-foreground">Explanation:</span><br />{anomalies.explanation ?? 'Not available'}</p>
                        <p className="border border-border bg-muted p-3 text-muted-foreground sm:col-span-2"><span className="font-medium text-foreground">Recommendation:</span><br />{anomalies.recommendation ?? 'Review recent API traffic.'}</p>
                    </div>
                </section>
            )}

            {(!anomalies?.hasAnomaly || !anomalies.anomalyType || anomalies.anomalyType === 'none') && (
                <section className="flex h-full flex-col border border-border bg-card p-4">
                    <h3 className="font-semibold">Anomaly Detection</h3>
                    <p className="mt-4 text-sm text-muted-foreground">No anomalies were detected in the current telemetry.</p>
                </section>
            )}
        </div>
    );
};

const severityTextClass = (severity?: string) => {
    if (severity === 'critical' || severity === 'high') return 'text-red-600 dark:text-red-400';
    if (severity === 'medium') return 'text-amber-600 dark:text-amber-400';
    if (severity === 'low') return 'text-emerald-600 dark:text-emerald-400';
    return 'text-muted-foreground';
};
