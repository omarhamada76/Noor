# Noor

Arabic landing page builder with React admin UI, Express API, and TiDB Cloud (MySQL-compatible) database.

## Structure

- `client/` — React + Vite frontend
- `server/` — Express API

## Local development

```bash
# Server
cd server && cp .env.example .env   # add your DB credentials
npm install && npm run migrate && npm start

# Client (separate terminal)
cd client && npm install && npm run dev
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Render (API) + InfinityFree (frontend).
