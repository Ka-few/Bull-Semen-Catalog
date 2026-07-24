# PrimeGenetics — Bull Semen Catalog

A role-based marketplace for dairy farmers to discover bull semen, arrange veterinary AI services, and source stock from agri-suppliers.

**Live demo:** https://digital-bull-catalog-amber.vercel.app/ · **API:** https://bull-catalog.onrender.com/ · **Repository:** https://github.com/Ka-few/Bull-Semen-Catalog

## What it does

- Farmers browse and filter bulls, manage a cart, place orders, and complete demo payments.
- Vets maintain profiles, are verified by admins, and see assigned orders.
- Agri-suppliers manage profiles and bull inventory.
- Admins manage the bull catalog and vet verification.
- Location-aware vet and supplier results help farmers choose nearby providers.

## Architecture

```text
React + TypeScript + Vite
          │ HTTP / Bearer token
          ▼
Node.js + Express API
          │ @supabase/supabase-js
          ▼
Supabase Auth ── PostgreSQL + RLS ── Storage
```

The frontend lives in `frontend/`; the Express API lives in `backend/`. Supabase Auth owns passwords and sessions. PostgreSQL stores application profiles, catalog, carts, orders, and inventory. Row Level Security scopes data to the authenticated user and role.

## Stack

- Frontend: React, TypeScript, Vite, Tailwind CSS, Axios, React Router, React Leaflet
- Backend: Node.js, Express, Supabase JavaScript client
- Platform: Supabase Auth, PostgreSQL, Row Level Security, Storage

## Screenshots

> Add real product captures to `docs/screenshots/` using the filenames below. Keeping screenshots in the repository makes the README render on GitHub and gives recruiters a quick product tour.

| Catalog | Role dashboard | Checkout |
| --- | --- | --- |
| `![Bull catalog](docs/screenshots/catalog.png)` | `![Supplier dashboard](docs/screenshots/supplier-dashboard.png)` | `![Order payment](docs/screenshots/payment.png)` |

## Local setup

Prerequisites: Node.js 18+ and a Supabase project.

1. Create `backend/.env` from `backend/.env.example` and add your project credentials:

   ```env
   PORT=5000
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your_publishable_key
   SUPABASE_SECRET_KEY=your_server_secret_key
   ```

   Never expose `SUPABASE_SECRET_KEY` to the browser or commit it.

2. In the Supabase SQL Editor, run the migrations in order:

   ```text
   supabase/migrations/001_initial_schema.sql
   supabase/migrations/002_payment_rpc.sql
   supabase/seed.sql
   ```

3. Install and run the API:

   ```bash
   cd backend
   npm install
   npm run dev
   ```

   The API listens on `http://localhost:5000`.

4. In a second terminal, run the frontend:

   ```bash
   cd frontend
   npm install
   npm run dev
   ```

   Open `http://localhost:5173`.

## Demo accounts

After applying the schema and catalog seed, run `node scripts/seed-supabase.js` from the repository root to provision these development-only accounts:

| Role | Username | Password |
| --- | --- | --- |
| Admin | `admin` | `securepassword` |
| Vet | `vet_john` | `password123` |
| Supplier | `sup_agro` | `password123` |

Do not use these credentials in production. Rotate or remove them before deployment.

## Database migration

The project includes a SQLite-to-Supabase migration path:

- `scripts/export-sqlite-to-json.js` exports the legacy database.
- `scripts/migrate-json-to-supabase.js` creates Auth users and remaps profiles, carts, inventory, orders, and items.
- `docs/SUPABASE_MIGRATION.md` documents the schema, RLS design, Storage buckets, rollback plan, and deployment checklist.

## Project structure

```text
backend/                 Express API, controllers, auth middleware
frontend/                React application
supabase/migrations/     PostgreSQL schema and RPC migrations
supabase/seed.sql        Demo bull catalog
scripts/                 One-time seed/export/import utilities
docs/                    Migration and deployment documentation
```

## License

MIT
