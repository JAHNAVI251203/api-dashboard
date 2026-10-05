# API Sentinel Dashboard

The React dashboard for API Sentinel, a backend-focused API telemetry and analytics project. It turns the backend's PostgreSQL aggregates, worker-produced AI insights, and Socket.IO events into an operational view of recent API activity.

This repository contains the dashboard only. The ingestion pipeline, queues, workers, database, Redis, alerting, and API live in the separate `api-analytics` backend repository.

## What It Shows

- Request volume, average and maximum response time, success rate, and error rate for the selected window.
- API traffic timeline, status-code distribution, and top endpoint breakdowns using Recharts.
- Dashboard AI summary, error analysis, and anomaly-detection results produced by the backend worker.
- A live activity feed populated by persisted telemetry delivered over Socket.IO.
- Error notifications for failed monitored API requests.
- Four time windows: last hour, 6 hours, 24 hours, and 7 days.
- Light and dark themes, responsive layouts, loading skeletons, empty states, retry UI, and toast feedback.
- A controlled **Run Demo Scenario** action that asks the backend to run its 20-request Demo API scenario.

## How It Works

```text
React dashboard
  ├─ GET /dashboard          → metrics, timeline, endpoint and status data
  ├─ GET /ai/*               → cached or pending worker-produced insights
  ├─ POST /demo/run          → controlled backend demo scenario
  └─ Socket.IO subscriptions → new telemetry and failed-request notifications
```

The dashboard loads analytics when the selected time range changes and refreshes them every 30 seconds. It joins the Socket.IO `logs` and `alerts` rooms; a `new-log` event updates the live feed and triggers a short delayed dashboard refresh, while an `error-alert` event displays a notification. AI insight requests refresh every five minutes.

## Tech Stack

| Area | Technologies |
| --- | --- |
| UI | React 19, TypeScript, Tailwind CSS utilities |
| Data access | Axios |
| Visualizations | Recharts |
| Real-time | Socket.IO Client |
| Feedback and testing | React Toastify, React Testing Library, Jest DOM |
| Production container | Docker multi-stage build with Nginx |

## Backend Contract Used by the Dashboard

| Method | Endpoint | Used for |
| --- | --- | --- |
| `GET` | `/dashboard?timeRange=...` | Overview cards, charts, status distribution, endpoints, and the cached dashboard summary. |
| `GET` | `/ai/analyze-errors` | Cached/pending error analysis. |
| `GET` | `/ai/detect-anomalies` | Cached/pending anomaly result. |
| `POST` | `/demo/run` | Starts the backend's controlled demo scenario. |

The dashboard expects the backend API and Socket.IO server to be reachable at the environment values below. Core analytics remain separate from AI results: the UI can still show dashboard data if AI insight requests fail.

## Project Structure

```text
api-dashboard/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx          # data loading, Socket.IO, dashboard composition
│   │   ├── DashboardPanels.tsx    # summary, status-code, endpoint visualizations
│   │   ├── Chart.tsx              # request/error time-series chart
│   │   ├── AIInsights.tsx         # error and anomaly panels
│   │   └── ui/                    # local reusable UI primitives
│   ├── services/api.ts            # Axios API client
│   ├── types/dashboard.ts         # backend response shapes
│   ├── App.tsx                    # application root and toast container
│   └── index.css                  # global styles and theme variables
├── public/                        # static Create React App assets
├── Dockerfile                     # build and Nginx image
└── package.json
```

## Local Development

### Prerequisites

- Node.js 18+ and npm
- A running API Sentinel backend at `http://localhost:8000`, or equivalent reachable API and Socket.IO URLs

### Configure and run

```powershell
Copy-Item .env.example .env
npm install
npm start
```

Set the following values in `.env`:

```env
REACT_APP_API_URL=http://localhost:8000
REACT_APP_SOCKET_URL=http://localhost:8000
```

The development server opens at `http://localhost:3000`.

For the complete local system—including PostgreSQL, Redis, the Express API, BullMQ worker, Demo API, and this dashboard—run `docker compose up --build` from the sibling `api-analytics` repository. Its Compose file builds this dashboard from the adjacent `api-dashboard` directory.

## Scripts

```powershell
npm start       # start the Create React App development server
npm test        # run the interactive test runner
npm run build   # create an optimized production build
```

## Docker

The provided Dockerfile builds the React application with configurable `REACT_APP_API_URL` and `REACT_APP_SOCKET_URL` build arguments, then serves the static output from Nginx on port 80. The sibling backend Compose configuration supplies both values for the full local stack.

## Demo

- Dashboard: https://ai-api-analytics-dashboard.vercel.app
- Backend: https://ai-api-analytics-platform-production.up.railway.app

## Companion Backend

See the sibling `api-analytics` repository for the telemetry ingestion contract, PostgreSQL schema, Redis/BullMQ design, Socket.IO server, alerting behavior, AI worker integration, and Docker Compose setup.
