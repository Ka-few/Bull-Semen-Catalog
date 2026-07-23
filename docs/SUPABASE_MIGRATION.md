# SQLite to Supabase migration

## Existing SQLite structure

| Table | Key relationships | Notes |
| --- | --- | --- |
| users | parent of farmers, vets, suppliers, carts, orders | username unique; password hash; role check |
| farmers | `user_id -> users` cascade | profile/location |
| agri_suppliers | `user_id -> users` cascade | profile/location |
| bulls | referenced by carts, order_items, inventory | registration number unique |
| vets | `user_id -> users` cascade; referenced by orders set null | verification/rating |
| carts | user + bull cascade | no SQLite unique constraint originally |
| orders | farmer cascade, vet/supplier set null | two status checks |
| order_items | order/bull cascade | item price snapshot |
| agri_supplier_inventory | supplier/bull cascade | supplier + bull unique |

SQLite used integer autoincrement IDs, `TEXT`, `REAL`, `DATETIME`, foreign keys enabled by PRAGMA, and no declared indexes beyond PK/unique indexes. Its demo data is five bulls, the default `admin`, three vets, and three suppliers. The obsolete `seed_providers.js` also contained an additional vet/supplier fixture.

## Design changes and compatibility

`public.users.id` is now exactly `auth.users.id` (UUID). Supabase Auth owns passwords, sessions, resets, and email confirmation. This is the only intentional API data-type change: frontend `User.id` is a string; all endpoint paths and field names remain unchanged. Usernames are adapted internally to an email-shaped Auth identifier, so the existing username/password UI remains unchanged.

All money/metrics use exact `numeric` rather than SQLite floating point where accuracy matters. Identity columns replace `AUTOINCREMENT`; status checks are PostgreSQL enums; required unique ownership constraints prevent duplicate profiles/cart lines; non-negative/range checks protect quantities, prices and coordinates. `updated_at` triggers, query indexes, RLS, and transactional checkout are added without removing business behaviour. `order_items.bull_id` uses `RESTRICT` rather than the legacy cascade so completed order history cannot silently lose its item when a bull is deleted.

## Apply and migrate

1. Create a Supabase project and copy `backend/.env.example` to `backend/.env`.
2. Run [`001_initial_schema.sql`](../supabase/migrations/001_initial_schema.sql) and then [`seed.sql`](../supabase/seed.sql) in the SQL editor.
3. In Supabase Auth, turn off email confirmation for demo login, or configure SMTP/confirmation redirects.
4. Run `node scripts/seed-supabase.js` to create Auth-backed demo accounts. Demo passwords are only for development—rotate them immediately.
5. For a real existing database, export it with `node scripts/export-sqlite-to-json.js backend/database.sqlite migration-data.json` while the old SQLite package is still installed. Then run `MIGRATION_PASSWORD=<temporary-password> node scripts/migrate-json-to-supabase.js migration-data.json`. The importer creates Auth UUIDs and remaps every profile, cart, inventory, order, and order item foreign key. It deliberately cannot migrate bcrypt hashes; force every migrated account to reset the temporary password.
6. Run `npm install` in `backend`, then start normally. Never put `SUPABASE_SECRET_KEY` in the frontend.

## Storage examples

Use the authenticated browser client or a server user-scoped client:

```js
await supabase.storage.from('bull-images').upload(`bulls/${bullId}/${file.name}`, file, { upsert: false });
await supabase.storage.from('vet-certificates').upload(`${user.id}/${file.name}`, file);
await supabase.storage.from('supplier-documents').upload(`${user.id}/${file.name}`, file);
```

`bull-images` is public; certificate/document buckets are private and only the owner (or service role) can access their object paths.

## Rollback strategy

Take a Supabase database backup and retain the read-only SQLite file/JSON export before cutover. Deploy the backend with environment-based feature branching, validate catalog/profile/order counts, and only then redirect traffic. To roll back, restore the Supabase backup or point the previous release at the retained SQLite data; do not attempt destructive down-migrations against production orders.

## Deployment checklist

- SQL migration and seed applied; storage buckets exist.
- Auth email settings, site URL, and redirect URLs configured.
- Backend environment set; service-role key is server-only.
- RLS tested with farmer, vet, supplier, and admin sessions.
- Create-cart-checkout and payment flows tested against a staging project.
- Rotate demo credentials and remove demo accounts before production.
