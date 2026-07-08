<div align="center">

# 💼 Job Application Tracker

**Pipeline Management + Analytics Dashboard**

A full-stack application to track job applications through a five-stage hiring pipeline with real-time analytics.

![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14%2B-4169E1?logo=postgresql&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?logo=tailwindcss&logoColor=white)

</div>

---

## 📋 Overview

Users can **register/login**, log every job application, move them through the hiring pipeline, and view live dashboard metrics — all in a responsive, modern UI.

**Pipeline:** `Applied` → `Screening` → `Interview` → `Offer` → `Closed`

### ✨ Key Features

- 🔐 JWT-based authentication (register, login, protected routes)
- 📊 Live analytics dashboard with per-status counts & response rate
- 🔄 Inline status updates from the list view (no modal needed)
- 🔍 Debounced search (300ms) with status filtering
- ✅ Client + server validation using Zod
- 📱 Fully responsive design with dark mode support

---

## 🛠️ Prerequisites

| Tool       | Version                        |
| ---------- | ------------------------------ |
| Node.js    | v18 or higher                  |
| PostgreSQL | v14 or higher (local or cloud) |
| npm        | v9 or higher                   |

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone <your-repo-url>
cd Job-Application-Tracker
```

### 2️⃣ Backend Setup

```bash
cd server
cp .env.example .env       # Configure your database & JWT secret
npm install
npm run dev                 # Starts on http://localhost:5001
```

> **Note:** The server auto-creates database tables on startup using `db/init.sql`.

### 3️⃣ Frontend Setup

```bash
cd client
cp .env.example .env
npm install
npm run dev                 # Starts on http://localhost:5173
```

---

## 🔑 Environment Variables

### Server (`server/.env`)

| Variable         | Required | Description                                      | Default                 |
| ---------------- | -------- | ------------------------------------------------ | ----------------------- |
| `PORT`           | No       | Server port                                      | `5001`                  |
| `NODE_ENV`       | No       | `development` or `production`                    | `development`           |
| `DATABASE_URL`   | **Yes**  | PostgreSQL connection string                     | —                       |
| `JWT_SECRET`     | **Yes**  | Secret for signing JWTs (app crashes without it) | —                       |
| `JWT_EXPIRES_IN` | No       | Token expiry (e.g. `7d`, `24h`)                  | `7d`                    |
| `CORS_ORIGIN`    | No       | Allowed frontend URL                             | `http://localhost:5173` |

### Client (`client/.env`)

| Variable       | Required | Description          | Default                     |
| -------------- | -------- | -------------------- | --------------------------- |
| `VITE_API_URL` | **Yes**  | Backend API base URL | `http://localhost:5001/api` |

---

## 📡 API Endpoints

### Auth Routes

| Method | Endpoint             | Description             |
| ------ | -------------------- | ------------------------|
| `POST` | `/api/auth/register` | Register new user       |
| `POST` | `/api/auth/login`    | Login & receive JWT     |
| `GET`  | `/api/auth/me`       | Get current user profile|

### Application Routes (all protected)

| Method   | Endpoint                       | Description                                                     |
| -------- | ------------------------------ | --------------------------------------------------------------- |
| `GET`    | `/api/applications`            | List all (supports `?page=`, `?limit=`, `?status=`, `?search=`, `?sort=`, `?order=`) |
| `POST`   | `/api/applications`            | Create new application                                          |
| `PUT`    | `/api/applications/:id`        | Update application                                              |
| `PATCH`  | `/api/applications/:id/status` | Inline status change                                            |
| `DELETE` | `/api/applications/:id`        | Delete application                                              |
| `GET`    | `/api/applications/stats`      | Dashboard statistics                                            |

---

## 📂 Project Structure

```
Job-Application-Tracker/
├── client/                   # React + Vite frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── hooks/            # Custom hooks (useAuth, useApplications, useDebounce)
│   │   ├── pages/            # Page components (Login, Register, Dashboard)
│   │   ├── routes/           # AppRouter, PrivateRoute
│   │   ├── services/         # Axios API service layer
│   │   ├── utils/            # Formatters, status config
│   │   └── validations/      # Zod schemas (client-side)
│   └── .env.example
│
├── server/                   # Node.js + Express backend
│   ├── config/               # App configuration
│   ├── controllers/          # Route handlers
│   ├── db/                   # Pool setup + init.sql
│   ├── middleware/           # Auth, validation, error handler
│   ├── routes/               # Express routers
│   ├── services/             # Business logic layer
│   ├── utils/                # ApiError, asyncHandler
│   └── validators/           # Zod schemas (server-side)
│
└── README.md
```

---

## 📝 Design Decisions & Assumptions

| #   | Decision                          | Explanation                                                                                                                                                                        |
| --- | --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **PostgreSQL instead of MongoDB** | PostgreSQL was chosen for relational integrity.|
| 2   | **Extra `PATCH /status` route**   | Added for the required "inline status update from the list view" .                                                                                               |
| 3   | **Flat stats response**           | Returns `{total, Applied, Screening, ...responseRate}` instead of `[{status, count}]` — easier for the frontend StatsPanel.                                                        |
| 4   | **`asyncHandler` wrapper**        | Wraps all async controllers instead of inline try/catch. Achieves the same "no unhandled rejections" goal with cleaner code.                                                       |
| 5   | **409 for duplicate email**       | Returns HTTP 409 Conflict instead of 400 — more semantically correct in REST.                                                                                                      |
| 6   | **camelCase in / snake_case out** | Requests use camelCase (`appliedDate`), responses return snake_case (`applied_date`) matching PostgreSQL columns. Frontend handles both.                                           |
| 7   | **Forward-only pipeline**         | Status moves one step forward only. "Closed" is reachable from any stage (rejections/withdrawals) but is terminal.                                                                 |
| 8   | **Rate limiting on auth routes**  | Configured `express-rate-limit` on `/register` and `/login` (max 20 requests per 15 minutes) to protect against brute-force attacks.                                               |

---

## 🚀 Extra Features Added

We implemented several extra enhancements for security, user experience, and visual aesthetics:

1. **Interactive Kanban Board View** — Toggles between List and Board view dynamically on desktop. Features drag-and-drop actions to progress applications in the hiring pipeline.
2. **Interactive Column Header Sorting** — Allows clicking Company and Applied columns to toggle sorting order (Ascending/Descending).
3. **Robust CSV Data Exporting** — Extracts all filtered applications directly from the API, properly wrapping fields in quotes to support notes or names containing commas.
4. **Authentication Rate Limiting** — Configured security constraints (`express-rate-limit`) on login and registration requests to mitigate brute-force attempts.

---

---

## 🌐 Deployment

- **Frontend**: Hosted on [Vercel](https://vercel.com)
- **Backend**: Hosted on [Render](https://render.com)

> [!IMPORTANT]
> The backend server is hosted on Render's free tier. As a result, the server will automatically spin down (sleep) after a period of inactivity. Please allow **50+ seconds** for the Render server to spin up and start responding on your first request or initial login.

----

## 🧪 Testing the API

### 📬 Postman Collection Documentation
The public API documentation and request collection is hosted here:
👉 **[Public Postman Documentation](https://documenter.getpostman.com/view/40303277/2sBY4Jx3ja)**

### 💻 cURL Examples
You can run these in your terminal or paste them into Postman:

#### **Register User**
```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john.doe@example.com","password":"password123"}'
```

#### **Login User**
```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john.doe@example.com","password":"password123"}'
```

#### **List Applications** (replace `<TOKEN>` with your JWT)
```bash
curl -X GET "http://localhost:5001/api/applications?page=1&limit=10&sort=applied_date&order=desc" \
  -H "Authorization: Bearer <TOKEN>"
```

#### **Create Application**
```bash
curl -X POST http://localhost:5001/api/applications \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"company":"Google","role":"Software Engineer","location":"remote","status":"Applied","appliedDate":"2026-07-08","salaryExpectation":120000}'
```

#### **Update Status (Inline)** (replace `<ID>` with application UUID)
```bash
curl -X PATCH http://localhost:5001/api/applications/<ID>/status \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status":"Interview"}'
```

#### **Get Statistics**
```bash
curl -X GET http://localhost:5001/api/applications/stats \
  -H "Authorization: Bearer <TOKEN>"
```
