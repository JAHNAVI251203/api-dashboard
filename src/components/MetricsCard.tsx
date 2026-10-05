import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

type MetricTone = 'blue' | 'violet' | 'green' | 'red';
type MetricIcon = 'hits' | 'latency' | 'success' | 'errors';

interface MetricsCardProps {
    title: string;
    value: string | number;
    detail?: string;
    tone: MetricTone;
    icon: MetricIcon;
}

export const MetricsCard: React.FC<MetricsCardProps> = ({
    title,
    value,
    detail,
    tone,
    icon,
}) => {
    const styles = toneStyles[tone];

    return (
        <Card className="overflow-hidden">
            <CardHeader className="flex-row items-center justify-between space-y-0 p-4 pb-2">
                <CardTitle className="text-base font-medium text-foreground">{title}</CardTitle>
                <span aria-hidden="true" className={`inline-flex h-10 w-10 items-center justify-center ${styles.icon}`}>
                    <MetricIconGraphic icon={icon} />
                </span>
            </CardHeader>
            <CardContent className="p-4 pt-0">
                <div className="text-3xl font-semibold tracking-tight text-foreground">{value}</div>
                {detail && <div className="mt-2 text-xs text-muted-foreground">{detail}</div>}
            </CardContent>
        </Card>
    );
};

const toneStyles: Record<MetricTone, { icon: string }> = {
    blue: { icon: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300' },
    violet: { icon: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300' },
    green: { icon: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
    red: { icon: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300' },
};

const MetricIconGraphic: React.FC<{ icon: MetricIcon }> = ({ icon }) => {
    if (icon === 'latency') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="8" /><path d="M12 7v5l3 2" />
            </svg>
        );
    }

    if (icon === 'success') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="12" cy="12" r="8" /><path d="m8.5 12 2.2 2.2 4.8-4.8" />
            </svg>
        );
    }

    if (icon === 'errors') {
        return (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="m12 4 8 15H4L12 4Z" /><path d="M12 9v4M12 16h.01" />
            </svg>
        );
    }

    return (
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M5 16 10 11l3 3 6-7" /><path d="M15 7h4v4" />
        </svg>
    );
};
