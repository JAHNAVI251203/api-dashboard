# AI-Powered API Analytics & Monitoring Platform

A full-stack monitoring platform that provides real-time API analytics, error tracking, anomaly detection, AI-powered error analysis, and performance monitoring.

## Live Demo

Frontend: https://ai-api-analytics-dashboard.vercel.app/

Backend: https://ai-api-analytics-platform-production.up.railway.app/

---

## Features

- Real-time API monitoring
- API request analytics dashboard
- Error tracking & grouping
- AI-powered error analysis using Gemini AI
- Anomaly detection system
- Background job processing with BullMQ
- Redis caching
- Search & filtering
- CSV export
- Toast notifications
- WebSocket live updates
- Dockerized deployment

---

## Tech Stack

### Frontend
- React
- TypeScript
- Axios
- Recharts
- Socket.io Client
- React Toastify

### Backend
- Node.js
- Express
- TypeScript
- PostgreSQL
- Redis
- BullMQ
- Socket.io
- Gemini AI & OpenRouter

### Deployment
- Vercel
- Railway
- Docker

---

## Architecture


---

# 2. Architecture Diagram


                    ┌─────────────────┐
                    │     Users       │
                    └────────┬────────┘
                             │
                             ▼
                    ┌─────────────────┐
                    │ React Dashboard │
                    │  (Vercel)       │
                    └────────┬────────┘
                             │
                  REST APIs  │ WebSockets
                             ▼
              ┌──────────────────────────┐
              │ Express Backend          │
              │ Railway Deployment       │
              └──────┬─────────┬─────────┘
                     │         │
                     │         │
                     ▼         ▼
            ┌────────────┐ ┌────────────┐
            │ PostgreSQL │ │   Redis    │
            │ Analytics  │ │   Cache    │
            └────────────┘ └────────────┘
                     │
                     ▼
            ┌────────────────┐
            │ BullMQ Workers │
            └───────┬────────┘
                    │
                    ▼
            ┌────────────────┐
            │ Gemini AI      │
            │ Error Analysis │
            └────────────────┘

---

## Screenshots

(Add dashboard screenshots)

---

## API Endpoints

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | /health | Health check |
| GET | /api/dashboard | Dashboard analytics |
| POST | /api/logs | Ingest API logs |
| POST | /api/ai/analyze-errors | AI error analysis |

---

## Installation

### Clone Repository

```bash
git clone <repo-url>
cd api-analytics
