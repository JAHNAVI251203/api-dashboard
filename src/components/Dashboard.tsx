import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { AIInsights } from './AIInsights';
import { Chart } from './Chart';
import { StatusCodeDistribution, TopEndpoints, TrafficSummary } from './DashboardPanels';
import { MetricsCard } from './MetricsCard';
import { ThemeToggle } from './ThemeToggle';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { DashboardData, MetricValue, RealtimeLog } from '../types/dashboard';

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [timeRange, setTimeRange] = useState('1 hour');
    const [scenarioRunning, setScenarioRunning] = useState(false);
    const [realtimeLogs, setRealtimeLogs] = useState<RealtimeLog[]>([]);
    const refreshTimeout = useRef<number | undefined>(undefined);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setDashboardError(false);

            try {
                const response = await api.getDashboard(timeRange);
                if (!active) return;
                setData(response.data.data as DashboardData);
            } catch {
                if (active) setDashboardError(true);
            } finally {
                if (active) setLoading(false);
            }
        };

        void loadDashboard();
        const interval = window.setInterval(loadDashboard, 30000);
        return () => {
            active = false;
            window.clearInterval(interval);
        };
    }, [timeRange, reloadKey]);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_URL!);

        newSocket.on('connect', () => {
            newSocket.emit('subscribe', 'logs');
            newSocket.emit('subscribe', 'alerts');
        });

        newSocket.on('connect_error', () => {
            toast.error('Live activity is temporarily unavailable. Dashboard analytics remain available.');
        });

        newSocket.on('new-log', (event: unknown) => {
            if (!isRecord(event) || !isRealtimeLog(event.log)) return;
            const log = event.log;
            setRealtimeLogs(previous => [log, ...previous].slice(0, 10));
            window.clearTimeout(refreshTimeout.current);
            refreshTimeout.current = window.setTimeout(() => setReloadKey(value => value + 1), 750);
        });

        newSocket.on('error-alert', (event: unknown) => {
            if (!isRecord(event) || !isRecord(event.error)) return;

            const method = typeof event.error.method === 'string' ? event.error.method : 'API';
            const endpoint = typeof event.error.endpoint === 'string' ? event.error.endpoint : 'endpoint';
            const statusCode = typeof event.error.status_code === 'number' ? event.error.status_code : 'error';
            toast.error(`Monitored API error: ${method} ${endpoint} returned ${statusCode}.`);
        });

        return () => {
            newSocket.close();
            window.clearTimeout(refreshTimeout.current);
        };
    }, []);

    const runDemoScenario = async () => {
        setScenarioRunning(true);
        try {
            await api.runDemoScenario();
            toast.success('Demo scenario queued. Processing telemetry; insights will update shortly.');
        } catch {
            toast.error('The demo scenario could not run. Please try again.');
        } finally {
            setScenarioRunning(false);
        }
    };

    if (loading && !data) return <DashboardLoading />;

    if (!data) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-background px-4 text-foreground">
                <Alert variant="destructive" className="max-w-lg">
                    <AlertTitle>Dashboard unavailable</AlertTitle>
                    <AlertDescription className="mt-2">We could not load dashboard analytics. Please try again.</AlertDescription>
                    <Button className="mt-4" variant="outline" onClick={() => setReloadKey(value => value + 1)}>Try again</Button>
                </Alert>
            </main>
        );
    }

    const { overview } = data;

    return (
        <main className="min-h-screen bg-background text-foreground">
            <header className="border-b border-border bg-background">
                <div className="flex w-full flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
                    <div>
                        <div>
                            <p className="text-xl font-bold uppercase tracking-[0.1em] text-primary sm:text-2xl">API Sentinel</p>
                            <p className="mt-1 text-sm text-muted-foreground">Backend-focused API telemetry, queues, caching, and real-time analytics.</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <ThemeToggle />
                        <Button onClick={() => void runDemoScenario()} disabled={scenarioRunning}>
                            {scenarioRunning ? 'Running…' : 'Run Demo Scenario'}
                        </Button>
                    </div>
                </div>
            </header>

            <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8">
                {dashboardError && (
                    <Alert variant="warning">
                        <AlertTitle>Latest dashboard refresh failed</AlertTitle>
                        <AlertDescription>Showing the most recent available analytics. We will retry automatically.</AlertDescription>
                    </Alert>
                )}

                <section aria-labelledby="dashboard-filters" className="grid gap-4 border-b border-border pb-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,220px)_1fr]">
                    <h2 id="dashboard-filters" className="sr-only">Dashboard filters</h2>
                    <div className="space-y-2">
                        <Label htmlFor="time-range">Time range</Label>
                        <Select id="time-range" value={timeRange} onValueChange={setTimeRange}>
                            <option value="1 hour">Last hour</option>
                            <option value="6 hours">Last 6 hours</option>
                            <option value="24 hours">Last 24 hours</option>
                            <option value="7 days">Last 7 days</option>
                        </Select>
                    </div>
                </section>

                <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricsCard title="Total Hits" value={formatNumber(overview.totalRequests)} detail={formatTimeRange(timeRange)} tone="blue" icon="hits" />
                    <MetricsCard title="Avg Response Time" value={formatDuration(overview.avgResponseTime)} detail={`Max response: ${formatDuration(overview.maxResponseTime)}`} tone="violet" icon="latency" />
                    <MetricsCard title="Success Rate" value={`${overview.successRate}%`} detail={`${formatNumber(overview.successCount ?? 0)} successful requests`} tone="green" icon="success" />
                    <MetricsCard title="Error Rate" value={`${overview.errorRate}%`} detail={`${formatNumber(overview.errorCount ?? 0)} errors`} tone="red" icon="errors" />
                </section>

                <section aria-label="API traffic and status code visuals" className="grid gap-4 lg:grid-cols-2">
                    <TrafficSummary overview={overview} />
                    <StatusCodeDistribution statusCodes={data.statusCodes ?? []} />
                </section>

                {data.aiSummary && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span>AI Summary: <span className="font-normal text-muted-foreground">API health overview with prioritized developer actions.</span></span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent><p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{data.aiSummary}</p></CardContent>
                    </Card>
                )}

                {realtimeLogs.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Activity: <span className="font-normal text-muted-foreground">Recent requests received through the live Socket.IO stream.</span></CardTitle>
                        </CardHeader>
                        <CardContent className="live-activity max-h-80 overflow-auto p-0">
                            <div className="hidden grid-cols-[24px_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] gap-4 border-b border-border bg-muted/50 px-5 py-2 text-center text-xs font-medium text-muted-foreground sm:grid">
                                <span aria-hidden="true" />
                                <span>Method</span>
                                <span>URL</span>
                                <span>Status Code</span>
                                <span>Response Time</span>
                            </div>
                            {realtimeLogs.map((log, index) => (
                                <div key={`${log.endpoint}-${log.method}-${index}`} className="grid gap-2 border-t border-border px-5 py-3 text-center text-sm first:border-t-0 sm:grid-cols-[24px_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)] sm:items-center sm:gap-4">
                                    <span aria-hidden="true" className={log.status_code >= 400 ? 'text-red-600' : 'text-emerald-600'}>●</span>
                                    <span className="font-mono text-xs font-semibold">{log.method}</span>
                                    <span className="min-w-0 truncate font-medium">{log.endpoint}</span>
                                    <span className={log.status_code >= 400 ? 'font-medium text-red-600' : 'font-medium text-emerald-600'}>{log.status_code}</span>
                                    <span className="tabular-nums text-muted-foreground">{formatDuration(log.response_time)}</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <section className="grid items-stretch gap-4 lg:grid-cols-2">
                    <Chart data={data.timeSeries} timeRange={timeRange} type="area" title="API Traffic Timeline" description={formatTimelineDescription(timeRange)} />
                    <TopEndpoints endpoints={data.endpoints} />
                </section>

                <section aria-labelledby="ai-insights">
                    <Card>
                        <CardHeader>
                            <CardTitle id="ai-insights">AI Insights: <span className="font-normal text-muted-foreground">Automated analysis of monitored API traffic.</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AIInsights />
                        </CardContent>
                    </Card>
                </section>
            </div>
        </main>
    );
};

const DashboardLoading: React.FC = () => (
    <main className="min-h-screen bg-background text-foreground">
        <div className="w-full space-y-6 px-4 py-6 sm:px-6 lg:px-8" aria-label="Loading dashboard">
            <div className="space-y-3"><Skeleton className="h-4 w-28" /><Skeleton className="h-9 w-72" /><Skeleton className="h-4 w-96 max-w-full" /></div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, index) => <Skeleton key={index} className="h-32" />)}</div>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]"><Skeleton className="h-96" /><Skeleton className="h-96" /></div>
        </div>
    </main>
);

const formatNumber = (value: MetricValue) => Number(value).toLocaleString();

const formatDuration = (value: MetricValue) => {
    const milliseconds = Number(value);
    return milliseconds >= 1000 ? `${(milliseconds / 1000).toFixed(1)} s` : `${milliseconds} ms`;
};

const formatTimeRange = (timeRange: string) => timeRange === '1 hour' ? 'Last hour' : `Last ${timeRange}`;

const timelineHours: Record<string, number> = {
    '1 hour': 1,
    '6 hours': 6,
    '24 hours': 24,
};

const formatTimelineDescription = (timeRange: string) => {
    if (timeRange === '7 days') return 'Daily request and error totals for the last 7 days.';

    const end = new Date();
    end.setSeconds(0, 0);
    const start = new Date(end.getTime() - timelineHours[timeRange] * 60 * 60 * 1000);
    const formatTime = (date: Date) => date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    if (timeRange !== '24 hours') return `Requests and errors from ${formatTime(start)} to ${formatTime(end)}.`;

    const formatDateTime = (date: Date) => `${date.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' })} (${formatTime(date)})`;
    return `Requests and errors from ${formatDateTime(start)} to ${formatDateTime(end)}.`;
};

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isRealtimeLog = (value: unknown): value is RealtimeLog => (
    isRecord(value) &&
    typeof value.endpoint === 'string' &&
    typeof value.method === 'string' &&
    typeof value.status_code === 'number' &&
    (typeof value.response_time === 'number' || typeof value.response_time === 'string')
);
