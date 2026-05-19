# Deploy Noor: Backend (API) + Frontend (InfinityFree)

InfinityFree hosts **static files only** (HTML/CSS/JS). Your **Node.js API** must run elsewhere. TiDB Cloud stays as the database.

```
[Browser] → InfinityFree (React app) → API host (Express) → TiDB Cloud
```

---

## Backend hosts that do NOT require a credit card

| Service | Card? | Notes |
|---------|-------|--------|
| **[Bonto](https://bonto.dev/register)** | No | Node-focused, GitHub deploy, free subdomain `*.bonto.run` |
| **[Zeabur](https://zeabur.com)** | No | GitHub deploy, auto-sleep on free tier |
| Render / Fly.io / Koyeb | Yes | Card required for verification |

Use the **same env vars** on any host (see below). After deploy, set `VITE_API_URL` in `client/.env.production` to your new API URL and run `npm run deploy:frontend`.

---

## Part 1A — Backend on Bonto (no card) — recommended

Bonto uses **Yarn only** — `npm install` is disabled in their containers.

1. Sign up at [bonto.dev/register](https://bonto.dev/register) (no card).
2. **New App** → connect GitHub → repo `omarhamada76/Noor`.
3. Set app root / working directory to **`server`**.
4. **Start command:** `npm run start` (Bonto blocks `npm install` and `yarn start`).
5. Add environment variables in Bonto **Settings** (paste from `server/.env`, no FTP vars, no `PORT`).
6. **Restart** the app.
7. TiDB → **IP Access List** → allow `0.0.0.0/0` if connections fail.

**Terminal on Bonto:**

```bash
cd server
yarn          # installs packages (npm install is disabled)
npm run start # runs the API (yarn start is not allowed)
```

Test: `https://YOUR-APP.bonto.run/api/health` → `{"ok":true}`

---

## Part 1B — Backend on Zeabur (no card)

1. Sign up at [zeabur.com](https://zeabur.com) (no card on free plan).
2. **Create Project** → **Deploy from GitHub** → `Noor`.
3. Select the **`server`** folder as the service root.
4. Add env vars (table below), deploy.
5. Copy the public URL Zeabur assigns.

---

## Part 1C — Backend on Render (free, card required)

### 1. Push code to GitHub

Create a repo and push this project (do **not** commit `server/.env`).

### 2. TiDB IP access

In [TiDB Cloud](https://tidbcloud.com) → **noor-dev** → **Settings** → **IP Access List**:

- For development: add `0.0.0.0/0` (allow all), **or**
- After deploy, if connections fail, allow all and tighten later.

### 3. Create Render web service

1. [render.com](https://render.com) → **New** → **Web Service**
2. Connect your GitHub repo
3. Settings:

| Setting | Value |
|---------|--------|
| **Root Directory** | `server` |
| **Runtime** | Node |
| **Build Command** | `npm install` |
| **Start Command** | `node index.js` |
| **Plan** | Free |

### 4. Environment variables (Render dashboard)

Copy from your local `server/.env` and add:

| Key | Example |
|-----|---------|
| `NODE_ENV` | `production` |
| `DB_HOST` | `gateway01.eu-central-1.prod.aws.tidbcloud.com` |
| `DB_PORT` | `4000` |
| `DB_USER` | `2LBhQ5GT7j1gx5g.root` |
| `DB_PASSWORD` | *(your TiDB password)* |
| `DB_NAME` | `noor_db` |
| `DB_ENABLE_SSL` | `true` |
| `JWT_SECRET` | *(long random string)* |
| `SERVE_CLIENT` | `false` |
| `FRONTEND_URL` | `https://yoursite.infinityfreeapp.com` |

Use your real InfinityFree URL for `FRONTEND_URL` (no trailing slash). If you use a custom domain later, add it comma-separated:

`https://yoursite.infinityfreeapp.com,https://www.yourdomain.com`

### 5. Deploy

Click **Deploy**. When live, open:

`https://YOUR-SERVICE.onrender.com/api/health`

You should see: `{"ok":true}`

**Note:** Free Render services sleep after ~15 minutes of inactivity. The first request may take 30–60 seconds to wake up.

---

## Part 2 — Frontend on InfinityFree

### 1. Build locally with your API URL

```bash
cd client
cp .env.production.example .env.production
```

Edit `client/.env.production`:

```env
VITE_API_URL=https://YOUR-API-HOST.com
```

Build:

```bash
npm install
npm run build
```

Output is in `client/dist/`.

### 2. Upload to InfinityFree

1. [InfinityFree](https://infinityfree.net) → create account / site
2. Open **Control Panel** → **File Manager** → `htdocs` (or `public_html`)
3. Delete default files (`index.html`, etc.) if present
4. Upload **everything inside** `client/dist/` (not the `dist` folder itself):
   - `index.html`
   - `assets/` folder
   - `.htaccess` (enables React Router — already in `client/public/`)

### 3. Test

| URL | Expected |
|-----|----------|
| `https://yoursite.infinityfreeapp.com/` | Login / dashboard (after auth) |
| `https://yoursite.infinityfreeapp.com/login` | Login page |
| `https://yoursite.infinityfreeapp.com/your-page-slug` | Public landing page |

Default admin (if not changed): `admin@noor.com` / `adminpassword`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| API CORS error in browser | Set `FRONTEND_URL` on Render to your exact InfinityFree URL (https, no trailing slash) |
| `Access denied` / DB errors on Render | TiDB IP allow list; check env vars |
| Render very slow first load | Free tier cold start — normal |
| InfinityFree 404 on `/dashboard` | Upload `.htaccess` from build output |
| Login works locally but not live | Rebuild client with correct `VITE_API_URL` |
| Lead forms fail | Rebuild client after setting `VITE_API_URL` |

---

## Optional: custom domain

- **InfinityFree:** Point domain in panel → upload same `dist` files
- **Render:** Add custom domain in service settings
- Update `FRONTEND_URL` and rebuild client with production API URL if it changes
