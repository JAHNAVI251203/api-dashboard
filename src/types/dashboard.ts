export type DataSource = 'live' | 'sample';

export type MetricValue = number | string;

export interface DashboardOverview {
    totalRequests: MetricValue;
    avgResponseTime: MetricValue;
    maxResponseTime: MetricValue;
    errorRate: MetricValue;
    successRate: MetricValue;
}

export interface EndpointStats {
    endpoint: string;
    method: string;
    request_count: MetricValue;
    avg_response_time: MetricValue;
    error_count: MetricValue;
}

export interface TimeSeriesPoint {
    time_bucket: string;
    request_count: MetricValue;
    error_count: MetricValue;
}

export interface TopError {
    id: number;
    endpoint: string;
    method: string;
    occurrence_count: MetricValue;
    last_seen: string;
}

export interface DashboardData {
    overview: DashboardOverview;
    endpoints: EndpointStats[];
    topErrors: TopError[];
    timeSeries: TimeSeriesPoint[];
    aiSummary?: string;
    dataSource: DataSource;
    timestamp: string;
}

export interface RealtimeLog {
    endpoint: string;
    method: string;
    status_code: number;
    response_time: MetricValue;
}
