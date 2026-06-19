# AI-Powered API Analytics & Monitoring Platform

A full-stack monitoring platform that provides real-time API analytics, error tracking, anomaly detection, AI-powered error analysis, and performance monitoring.

## Live Demo

Frontend: https://your-vercel-url.vercel.app

Backend API:
https://your-railway-url.up.railway.app

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
- Gemini AI

### Deployment
- Vercel
- Railway
- Docker

---

## Architecture

(Insert architecture diagram)

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
