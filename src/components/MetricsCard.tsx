import React from 'react';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

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
    trend = 'neutral',
}) => {
    const trendLabel = trend === 'up' ? 'Improving' : trend === 'down' ? 'Watch' : 'Stable';
    const trendVariant = trend === 'up' ? 'success' : trend === 'down' ? 'destructive' : 'outline';

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
                <Badge variant={trendVariant}>{trendLabel}</Badge>
            </CardHeader>
            <CardContent>
                <div className="text-3xl font-semibold tracking-tight">{value}</div>
                {subtext && <div className="mt-2 text-xs text-muted-foreground">{subtext}</div>}
            </CardContent>
        </Card>
    );
};
