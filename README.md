# Party Vello

A responsive birthday-items e-commerce storefront for Party Vello, built with React, Vite, Express, and Mongo-ready backend architecture.

## Project layout

- client/: Vite React frontend
- server/: Express API and backend architecture

## Quick start

1. Install root dependencies:
   ```bash
   npm install
   ```

2. Install frontend dependencies:
   ```bash
   npm --prefix client install
   ```

3. Install backend dependencies:
   ```bash
   npm --prefix server install
   ```

4. Copy environment files:
   ```bash
   cp client/.env.example client/.env
   cp server/.env.example server/.env
   ```

5. Start both apps together:
   ```bash
   npm run dev
   ```

## Frontend

- URL: http://localhost:5173
- Command: `npm --prefix client run dev -- --host`

## Backend

- URL: http://localhost:5000
- Command: `npm --prefix server run dev`

## MongoDB

The backend is set up for MongoDB with a fallback demo mode that runs without a local database during development. For production, add your MongoDB connection string in `server/.env`:

```bash
MONGO_URI=mongodb://127.0.0.1:27017/partypops
JWT_SECRET=replace_with_a_secure_secret
```

## Deployment environment

Deploy the client and server with a persistent MongoDB database. Configure these environment variables in the hosting dashboards:

- **Client (build-time):** `VITE_API_URL=https://your-api-host.example/api`
- **Server:** `MONGO_URI=<your hosted MongoDB connection string>`
- **Server:** `JWT_SECRET=<a long, random secret>`
- **Server:** `CLIENT_URL=https://your-client-host.example`
- **Server:** `NODE_ENV=production`
- **Server (recommended):** set `ADMIN_EMAIL` and `ADMIN_PASSWORD` to replace the demo administrator credentials.

`CLIENT_URL` accepts comma-separated frontend origins when deploying multiple client domains. Set `VITE_API_URL` before building the client; production builds otherwise use the same-origin `/api` path. In production, the server refuses to start without `MONGO_URI` and a configured `CLIENT_URL`, rather than accepting registrations into temporary in-memory storage. Production auth cookies require HTTPS.

## Notes

- Local development can use the server's demo in-memory data mode when MongoDB is unavailable; registered demo accounts are not persistent.
- The backend includes structured routes, middleware, and models for an extensible production stack.
- Admin-only routes are protected conceptually in the front-end with role checks and in the backend with role-based authorization middleware.
