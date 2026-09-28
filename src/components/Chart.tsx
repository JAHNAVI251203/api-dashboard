import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { TimeSeriesPoint } from '../types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChartProps {
    data: TimeSeriesPoint[];
    type?: 'line' | 'area';
    title: string;
}

export const Chart: React.FC<ChartProps> = ({ data, type = 'line', title }) => (
    <Card className="min-w-0">
        <CardHeader>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            {data.length === 0 ? (
                <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
                    No request volume recorded for this range.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    {type === 'line' ? (
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time_bucket" tickFormatter={formatTime} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <RechartsTooltip />
                            <Legend />
                            <Line type="monotone" dataKey="request_count" stroke="#0f766e" name="Requests" />
                            <Line type="monotone" dataKey="error_count" stroke="#b91c1c" name="Errors" />
                        </LineChart>
                    ) : (
                        <AreaChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time_bucket" tickFormatter={formatTime} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
                            <RechartsTooltip />
                            <Legend />
                            <Area type="monotone" dataKey="request_count" stroke="#0f766e" fill="#99f6e4" fillOpacity={0.45} name="Requests" />
                            <Area type="monotone" dataKey="error_count" stroke="#b91c1c" fill="#fecaca" fillOpacity={0.45} name="Errors" />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            )}
        </CardContent>
    </Card>
);

const formatTime = (time: string) => {
    const date = new Date(time);
    return Number.isNaN(date.getTime()) ? time : date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};
