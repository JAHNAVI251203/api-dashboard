import React from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    TooltipContentProps,
    XAxis,
    YAxis,
} from 'recharts';
import { DashboardOverview, EndpointStats, MetricValue, StatusCodeCount } from '../types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

const formatNumber = (value: MetricValue) => Number(value).toLocaleString();

export const TrafficSummary: React.FC<{ overview: DashboardOverview }> = ({ overview }) => {
    const data = [
        { name: 'Total Hits', value: Number(overview.totalRequests), color: '#7c3aed' },
        { name: 'Success', value: Number(overview.successCount ?? 0), color: '#22c55e' },
        { name: 'Errors', value: Number(overview.errorCount ?? 0), color: '#ef4444' },
    ];

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>API Traffic Summary: <span className="font-normal text-muted-foreground">Total, successful, and failed requests for the selected range.</span></CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                        <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} axisLine={false} tickLine={false} />
                        <Tooltip content={<CompactChartTooltip />} cursor={false} />
                        <Bar dataKey="value" name="Hits" activeBar={false}>
                            {data.map(item => <Cell key={item.name} fill={item.color} />)}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    );
};

export const StatusCodeDistribution: React.FC<{ statusCodes: StatusCodeCount[] }> = ({ statusCodes }) => {
    const chartData = statusCodes
        .map((item, index) => ({
            statusCode: String(item.status_code),
            count: Number(item.count),
            color: statusColors[index % statusColors.length],
        }))
        .filter(item => Number.isFinite(item.count) && item.count > 0);
    const total = chartData.reduce((sum, item) => sum + item.count, 0);

    return (
        <Card className="min-w-0">
            <CardHeader>
                <CardTitle>Status Code Distribution: <span className="font-normal text-muted-foreground">HTTP response status breakdown for the selected range.</span></CardTitle>
            </CardHeader>
            <CardContent>
                {total === 0 ? (
                    <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">No status code data recorded for this range.</div>
                ) : (
                    <div className="flex h-[300px] flex-col">
                        <div className="min-h-0 flex-1">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={chartData} dataKey="count" nameKey="statusCode" innerRadius="58%" outerRadius="82%" paddingAngle={0} stroke="none" activeShape={false}>
                                        <Label value={`Total: ${formatNumber(total)}`} position="center" className="fill-foreground text-sm font-semibold" />
                                        {chartData.map(item => <Cell key={item.statusCode} fill={item.color} />)}
                                    </Pie>
                                    <Tooltip content={<CompactChartTooltip />} labelFormatter={label => `HTTP ${label}`} cursor={false} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                        <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 pt-2 text-xs text-muted-foreground">
                            {chartData.map(item => (
                                <span key={item.statusCode} className="flex items-center gap-1.5">
                                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                    {item.statusCode}: {formatNumber(item.count)}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const TopEndpoints: React.FC<{ endpoints: EndpointStats[] }> = ({ endpoints }) => {
    const topEndpoints = endpoints.slice(0, 3);

    return (
        <Card className="min-w-0 h-full">
            <CardHeader>
                <CardTitle>Top Endpoints: <span className="font-normal text-muted-foreground">The three most active monitored endpoints by hit count.</span></CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-2">
                {topEndpoints.length === 0 && <p className="text-sm text-muted-foreground">No monitored endpoints found.</p>}
                {topEndpoints.map((item, index) => <EndpointCard key={`${item.method}-${item.endpoint}`} endpoint={item} rank={index + 1} />)}
            </CardContent>
        </Card>
    );
};

export const CompactChartTooltip: React.FC<Partial<TooltipContentProps>> = ({ active, label, labelFormatter, payload = [] }) => {
    if (!active || payload.length === 0) return null;

    const tooltipLabel = label ?? payload[0]?.name ?? 'Value';
    const heading = labelFormatter ? labelFormatter(tooltipLabel, payload) : tooltipLabel;
    const isSingleValue = payload.length === 1;

    return (
        <div className="w-max max-w-52 bg-popover px-2 py-1.5 text-xs text-popover-foreground shadow-md">
            {!isSingleValue && <p className="mb-1 text-muted-foreground">{heading}</p>}
            <div className="space-y-1">
                {payload.map((item, index) => (
                    <div key={`${item.dataKey ?? item.name ?? 'value'}-${index}`} className="whitespace-nowrap">
                        <span>{isSingleValue ? heading : formatTooltipName(typeof item.name === 'string' || typeof item.name === 'number' ? item.name : 'Value')} - </span>
                        <span className="font-semibold tabular-nums">{formatTooltipValue(item.value)}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const EndpointCard: React.FC<{ endpoint: EndpointStats; rank: number }> = ({ endpoint, rank }) => {
    const requestCount = Number(endpoint.request_count);
    const errorCount = Number(endpoint.error_count);
    const errorRate = requestCount > 0 ? (errorCount / requestCount) * 100 : 0;

    return (
        <article className="border border-border bg-muted/30 p-3">
            <div className="flex min-w-0 items-center gap-3">
                <span aria-label={`Rank ${rank}`} className="inline-flex h-7 w-7 shrink-0 items-center justify-center bg-slate-500 text-xs font-bold text-white dark:bg-slate-600">{rank}</span>
                <p className="min-w-0 truncate font-mono text-sm font-semibold">{endpoint.endpoint}</p>
                <span className="shrink-0 border border-sky-300 px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wide text-sky-700 dark:border-sky-800 dark:text-sky-300">{endpoint.method}</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-2">
                <EndpointMetric label="Hits" value={formatNumber(endpoint.request_count)} icon="hits" tone="blue" />
                <EndpointMetric label="Avg Latency" value={`${Math.round(Number(endpoint.avg_response_time))} ms`} icon="latency" tone="violet" />
                <EndpointMetric label="Error Rate" value={`${errorRate.toFixed(2)}%`} icon="errors" tone={errorCount > 0 ? 'red' : 'green'} />
            </div>
        </article>
    );
};

const EndpointMetric: React.FC<{ label: string; value: string; icon: 'hits' | 'latency' | 'errors'; tone: 'blue' | 'violet' | 'green' | 'red' }> = ({ label, value, icon, tone }) => (
    <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span aria-hidden="true" className={`inline-flex h-5 w-5 items-center justify-center ${endpointIconTone[tone]}`}><EndpointIcon icon={icon} /></span>
            <span className="truncate">{label}</span>
        </div>
        <p className="mt-1 truncate text-sm font-semibold tabular-nums">{value}</p>
    </div>
);

const EndpointIcon: React.FC<{ icon: 'hits' | 'latency' | 'errors' }> = ({ icon }) => {
    if (icon === 'latency') return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7" /><path d="M12 8v4l2.5 1.5" /></svg>;
    if (icon === 'errors') return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="7" /><path d="M12 8v4M12 15.5h.01" /></svg>;
    return <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 16 5-5 3 3 6-7" /><path d="M15 7h4v4" /></svg>;
};

const endpointIconTone = {
    blue: 'bg-sky-100 text-sky-700 dark:bg-sky-950 dark:text-sky-300',
    violet: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
    green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300',
    red: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
};

const statusColors = ['#14b8a6', '#2563eb', '#f59e0b', '#ef4444', '#7c3aed'];

const formatTooltipName = (name: string | number) => String(name)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, letter => letter.toUpperCase());

const formatTooltipValue = (value: number | string | ReadonlyArray<number | string> | undefined) => (
    typeof value === 'string' || typeof value === 'number' ? Number(value).toLocaleString() : '—'
);
