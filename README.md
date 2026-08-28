# Rural Pond Restoration Progress Tracking and Water Body Health Analytics Dashboard

A MERN stack boilerplate with **3 user roles**: **Admin**, **Worker** (rural pond field manager), and **Public Citizen**.

## Project Structure

```
pond-restoration-mern/
├── backend/         Node.js + Express + MySQL API
│   ├── config/       DB connection
│   ├── models/       User, Pond, RestorationLog, WaterQualityRecord, CitizenReport
│   ├── middleware/    auth (JWT), role (RBAC), errorHandler
│   ├── controllers/   business logic
│   ├── routes/        REST endpoints
│   ├── seed/          initial admin creation script
│   └── server.js      entry point
└── frontend/        React (Vite) client
    ├── src/api/        axios instance with JWT interceptor
    ├── src/context/     AuthContext (login/register/logout state)
    ├── src/components/  Navbar, PrivateRoute (role-guarded routes)
    └── src/pages/       Login, Register, PublicPortal, WorkerDashboard, AdminDashboard
```

## Roles Implemented

| Role | Access |
|---|---|
| **Admin** | Register/approve users, create ponds, review & approve/reject restoration updates, view analytics dashboard |
| **Worker** | View assigned ponds, submit restoration stage updates, log water quality readings |
| **Citizen** | Browse public pond data, submit feedback/complaints/adopt-a-pond/water-level reports |

## Setup Instructions

### 1. Backend

```bash
cd backend
cp .env.example .env    # then edit DB_HOST, DB_USER, DB_PASSWORD, JWT_SECRET etc.
npm install
npm run dev              # starts on http://localhost:5000
```

Create the first Admin account (required before signing in):

```bash
npm run seed:admin
# Login with: admin@pondtrack.local / Admin@123
```

Create local demo accounts for the other roles:

```bash
npm run seed:demo-users
# Field worker: worker@pondtrack.local / Worker@123
# Public citizen: citizen@pondtrack.local / Citizen@123
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev               # starts on http://localhost:5173
```

The AquaMonitor login screen is the default page at `http://localhost:5173/`.

## Core API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public (citizen/worker signup) |
| POST | /api/auth/login | Public |
| GET  | /api/auth/me | Private |
| PUT  | /api/auth/approve/:id | Admin (approve pending worker) |
| GET/POST | /api/ponds | Private (role-filtered) |
| GET/PUT/DELETE | /api/ponds/:id | Private |
| PUT  | /api/ponds/:id/assign | Admin |
| GET  | /api/ponds/stats/summary | Admin |
| GET/POST | /api/restoration-logs | Worker submits, Admin/Worker view |
| PUT  | /api/restoration-logs/:id/review | Admin approves/rejects |
| GET/POST | /api/water-quality | Worker logs, all roles view |
| GET/POST | /api/citizen-reports | Citizen submits |
| PUT  | /api/citizen-reports/:id/moderate | Admin moderates |

## Notes

- This is a **boilerplate/starter**, not a production-ready system. Add input validation (e.g. Joi/Zod), file upload handling (Multer + Cloudinary/S3) for photos, rate limiting, and HTTPS before deployment.
- Passwords are hashed with bcrypt; auth uses JWT bearer tokens.
- The backend uses MySQL (`AquaPro` by default) via `mysql2` and creates its tables on startup.
- Worker accounts require Admin approval before login (`isApproved` flag).
- Water quality health scoring uses a simple threshold-based rule in `WaterQualityRecord.js` — refine with domain expert input.
- Extend freely with the additional features listed in the project's SRS document (maps, reports, notifications, etc.).

# AquaProject
