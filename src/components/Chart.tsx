import React from 'react';
import {
    Area,
    AreaChart,
    CartesianGrid,
    Label,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip as RechartsTooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { TimeSeriesPoint } from '../types/dashboard';
import { CompactChartTooltip } from './DashboardPanels';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface ChartProps {
    data: TimeSeriesPoint[];
    type?: 'line' | 'area';
    title: string;
    description: string;
    timeRange: string;
}

export const Chart: React.FC<ChartProps> = ({ data, description, timeRange, type = 'line', title }) => (
    <Card className="min-w-0 h-full">
        <CardHeader>
            <CardTitle>{title}: <span className="font-normal text-muted-foreground">{description}</span></CardTitle>
        </CardHeader>
        <CardContent className="flex h-[340px] items-center justify-center">
            {data.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                    No request volume recorded for this range.
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={300}>
                    {type === 'line' ? (
                        <LineChart data={data} margin={{ top: 18, right: 24, bottom: 18, left: 24 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time_bucket" tickFormatter={value => formatTime(value, timeRange)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} height={48} interval={timeRange === '7 days' ? 0 : 'preserveStartEnd'}>
                                <Label value="Time" position="insideBottom" offset={-8} fill="hsl(var(--muted-foreground))" fontSize={14} textAnchor="middle" />
                            </XAxis>
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={54}>
                                <Label value="Request Volume" angle={-90} position="insideLeft" offset={4} fill="hsl(var(--muted-foreground))" fontSize={14} textAnchor="middle" />
                            </YAxis>
                            <RechartsTooltip content={<CompactChartTooltip />} labelFormatter={value => formatTooltipTime(String(value), timeRange)} cursor={false} />
                            <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }} />
                            <Line type="monotone" dataKey="request_count" stroke="#0f766e" name="Requests" activeDot={false} />
                            <Line type="monotone" dataKey="error_count" stroke="#b91c1c" name="Errors" activeDot={false} />
                        </LineChart>
                    ) : (
                        <AreaChart data={data} margin={{ top: 18, right: 24, bottom: 18, left: 24 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                            <XAxis dataKey="time_bucket" tickFormatter={value => formatTime(value, timeRange)} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} height={48} interval={timeRange === '7 days' ? 0 : 'preserveStartEnd'}>
                                <Label value="Time" position="insideBottom" offset={-8} fill="hsl(var(--muted-foreground))" fontSize={14} textAnchor="middle" />
                            </XAxis>
                            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} width={54}>
                                <Label value="Request Volume" angle={-90} position="insideLeft" offset={4} fill="hsl(var(--muted-foreground))" fontSize={14} textAnchor="middle" />
                            </YAxis>
                            <RechartsTooltip content={<CompactChartTooltip />} labelFormatter={value => formatTooltipTime(String(value), timeRange)} cursor={false} />
                            <Legend verticalAlign="top" iconType="circle" wrapperStyle={{ fontSize: '12px', paddingBottom: '12px' }} />
                            <Area type="monotone" dataKey="request_count" stroke="#0f766e" fill="#99f6e4" fillOpacity={0.45} name="Requests" activeDot={false} />
                            <Area type="monotone" dataKey="error_count" stroke="#b91c1c" fill="#fecaca" fillOpacity={0.45} name="Errors" activeDot={false} />
                        </AreaChart>
                    )}
                </ResponsiveContainer>
            )}
        </CardContent>
    </Card>
);

const formatTime = (time: string, timeRange: string) => {
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return time;

    if (timeRange === '7 days') return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (timeRange === '24 hours') return date.toLocaleDateString([], { month: 'short', day: 'numeric', hour: 'numeric' });
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

const formatTooltipTime = (time: string, timeRange: string) => {
    const date = new Date(time);
    if (Number.isNaN(date.getTime())) return time;

    return date.toLocaleString([], timeRange === '7 days'
        ? { month: 'short', day: 'numeric', year: 'numeric' }
        : { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
};
