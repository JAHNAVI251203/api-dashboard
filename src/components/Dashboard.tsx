import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { exportToCSV } from '../utils/export';
import { AIInsights } from './AIInsights';
import { Chart } from './Chart';
import { ErrorList } from './ErrorList';
import { MetricsCard } from './MetricsCard';
import { ThemeToggle } from './ThemeToggle';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select } from './ui/select';
import { Skeleton } from './ui/skeleton';
import { DashboardData, DataSource, EndpointStats, MetricValue, RealtimeLog } from '../types/dashboard';

export const Dashboard: React.FC = () => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [dashboardError, setDashboardError] = useState(false);
    const [reloadKey, setReloadKey] = useState(0);
    const [timeRange, setTimeRange] = useState('7 days');
    const [dataSource, setDataSource] = useState<DataSource>('live');
    const [realtimeLogs, setRealtimeLogs] = useState<RealtimeLog[]>([]);
    const [searchEndpoint, setSearchEndpoint] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [searchResults, setSearchResults] = useState<EndpointStats[]>([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);

    useEffect(() => {
        let active = true;

        const loadDashboard = async () => {
            setLoading(true);
            setDashboardError(false);

            try {
                const response = await api.getDashboard(timeRange, dataSource);
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
    }, [timeRange, dataSource, reloadKey]);

    useEffect(() => {
        const newSocket = io(process.env.REACT_APP_SOCKET_URL!, {
            auth: { token: sessionStorage.getItem('apiToken') },
        });

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
        };
    }, []);

    useEffect(() => {
        if (!searchEndpoint.trim()) {
            setSearchResults([]);
            setSearchError(false);
            setSearchLoading(false);
            return undefined;
        }

        let active = true;
        setSearchLoading(true);
        setSearchError(false);

        const search = async () => {
            try {
                const response = await api.searchEndpoints(searchEndpoint, timeRange, statusFilter, dataSource);
                if (active) setSearchResults(response.data.data as EndpointStats[]);
            } catch {
                if (active) {
                    setSearchResults([]);
                    setSearchError(true);
                }
            } finally {
                if (active) setSearchLoading(false);
            }
        };

        void search();
        return () => {
            active = false;
        };
    }, [searchEndpoint, timeRange, statusFilter, dataSource]);

    const logout = () => {
        sessionStorage.removeItem('apiToken');
        window.location.reload();
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
                            <p className="mt-1 text-sm text-muted-foreground">AI-powered API analytics and monitoring platform</p>
                        </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                        <ThemeToggle />
                        <Button variant="outline" onClick={logout}>Log out</Button>
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

                <section aria-labelledby="dashboard-filters" className="grid gap-4 border-b border-border pb-6 sm:grid-cols-2 lg:grid-cols-[minmax(0,220px)_minmax(0,220px)_1fr]">
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
                    <div className="space-y-2">
                        <Label htmlFor="data-source">Data source</Label>
                        <Select id="data-source" value={dataSource} onValueChange={value => setDataSource(value as DataSource)}>
                            <option value="live">Live data</option>
                            <option value="sample">Sample data</option>
                        </Select>
                    </div>
                </section>

                <section aria-label="Key metrics" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricsCard title="Total Requests" value={formatNumber(overview.totalRequests)} />
                    <MetricsCard title="Avg Response Time" value={`${overview.avgResponseTime}ms`} subtext={`Max: ${overview.maxResponseTime}ms`} />
                    <MetricsCard title="Error Rate" value={`${overview.errorRate}%`} trend={Number(overview.errorRate) > 5 ? 'down' : 'neutral'} />
                    <MetricsCard title="Success Rate" value={`${overview.successRate}%`} trend="up" />
                </section>

                {data.aiSummary && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                                <span>AI Summary: <span className="font-normal text-muted-foreground">Cached overview of the selected API traffic.</span></span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent><p className="text-sm leading-6 text-muted-foreground">{data.aiSummary}</p></CardContent>
                    </Card>
                )}

                <section className="grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(320px,1fr)]">
                    <Chart data={data.timeSeries} type="area" title="Request Volume Over Time" />
                    <ErrorList errors={data.topErrors} dataSource={dataSource} />
                </section>

                {dataSource === 'live' && realtimeLogs.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Live Activity</CardTitle>
                            <CardDescription>Recent requests received through the live Socket.IO stream.</CardDescription>
                        </CardHeader>
                        <CardContent className="max-h-80 overflow-auto p-0">
                            {realtimeLogs.map((log, index) => (
                                <div key={`${log.endpoint}-${log.method}-${index}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-border px-5 py-3 text-sm first:border-t-0">
                                    <span aria-hidden="true" className={log.status_code >= 400 ? 'text-red-600' : 'text-emerald-600'}>●</span>
                                    <span className="font-medium">{log.method} {log.endpoint}</span>
                                    <span className="text-muted-foreground">{log.status_code} | {log.response_time}ms</span>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                )}

                <section aria-labelledby="endpoint-search" className="w-full space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle id="endpoint-search">Endpoint Search: <span className="font-normal text-muted-foreground">Filter monitored endpoints by path and response status.</span></CardTitle>
                        </CardHeader>
                        <CardContent className="grid items-end gap-4 sm:grid-cols-[minmax(0,1fr)_220px]">
                            <div>
                                <Input id="endpoint-search-input" aria-label="Search endpoint" placeholder="Search endpoint..." className="rounded-none" value={searchEndpoint} onChange={event => setSearchEndpoint(event.target.value)} />
                            </div>
                            <div>
                                <Select id="status-filter" aria-label="Filter endpoint status" value={statusFilter} onValueChange={setStatusFilter}>
                                    <option value="all">All status</option>
                                    <option value="2xx">Success (2xx)</option>
                                    <option value="4xx">Client errors (4xx)</option>
                                    <option value="5xx">Server errors (5xx)</option>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {searchLoading && <Skeleton className="h-28 w-full" aria-label="Loading endpoint results" />}
                    {searchError && (
                        <Alert variant="warning">
                            <AlertTitle>Endpoint search unavailable</AlertTitle>
                            <AlertDescription>We could not retrieve endpoint results right now. Please try again.</AlertDescription>
                        </Alert>
                    )}
                    {!searchLoading && !searchError && searchEndpoint.trim() && searchResults.length > 0 && (
                        <Card>
                            <CardHeader>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                    <div>
                                        <CardTitle>Endpoint Search Results</CardTitle>
                                    </div>
                                    <Button variant="outline" onClick={() => { exportToCSV(data.endpoints, 'endpoints'); toast.success('CSV exported successfully!'); }}>Export CSV</Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-0 p-0">
                                {searchResults.map((item, index) => (
                                    <div key={`${item.endpoint}-${item.method}-${index}`} className="grid gap-2 border-t border-border px-5 py-4 text-sm sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
                                        <div className="min-w-0">
                                            <p className="truncate font-medium">{item.method} {item.endpoint}</p>
                                            <p className="mt-1 text-xs text-muted-foreground">{formatNumber(item.request_count)} requests | {Math.round(Number(item.avg_response_time))}ms average</p>
                                        </div>
                                        <Badge variant={Number(item.error_count) > 0 ? 'destructive' : 'success'}>{formatNumber(item.error_count)} errors</Badge>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    )}
                    {!searchLoading && !searchError && searchEndpoint.trim() && searchResults.length === 0 && (
                        <Alert>
                            <AlertDescription>No monitored endpoints matched.</AlertDescription>
                        </Alert>
                    )}
                </section>

                <section aria-labelledby="ai-insights">
                    <Card>
                        <CardHeader>
                            <CardTitle id="ai-insights">AI Insights: <span className="font-normal text-muted-foreground">Automated analysis of monitored API traffic.</span></CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AIInsights dataSource={dataSource} />
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

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;

const isRealtimeLog = (value: unknown): value is RealtimeLog => (
    isRecord(value) &&
    typeof value.endpoint === 'string' &&
    typeof value.method === 'string' &&
    typeof value.status_code === 'number' &&
    (typeof value.response_time === 'number' || typeof value.response_time === 'string')
);
