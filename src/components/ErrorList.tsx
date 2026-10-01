import React from 'react';
import { TopError } from '../types/dashboard';
import { Badge } from './ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

interface ErrorListProps { errors: TopError[]; }

export const ErrorList: React.FC<ErrorListProps> = ({ errors }) => (
    <Card className="min-w-0">
        <CardHeader>
            <CardTitle>Top Errors (Last 24h)</CardTitle>
            <CardDescription>
                Repeated 4xx/5xx responses observed in real instrumented API traffic.
            </CardDescription>
        </CardHeader>
        <CardContent className="space-y-0">
            {errors.length === 0 && <p className="text-sm text-muted-foreground">No monitored API errors found.</p>}
            {errors.map(error => (
                <div key={error.id} className="border-t border-border py-4 first:border-t-0 first:pt-0 last:pb-0">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <Badge variant="destructive">{error.occurrence_count}×</Badge>
                            <span className="truncate text-sm font-medium">{error.method} {error.endpoint}</span>
                        </div>
                        <time className="text-xs text-muted-foreground" dateTime={error.last_seen}>
                            {formatDate(error.last_seen)}
                        </time>
                    </div>
                    <p className="mt-2 text-xs text-muted-foreground">Repeated monitored API responses for this endpoint.</p>
                </div>
            ))}
        </CardContent>
    </Card>
);

const formatDate = (value: string) => {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Recently observed' : date.toLocaleString();
};
