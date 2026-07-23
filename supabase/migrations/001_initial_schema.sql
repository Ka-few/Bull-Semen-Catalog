-- Bull Semen Catalog: Supabase/PostgreSQL schema
-- Run in the Supabase SQL editor before running the seed script.
create extension if not exists pgcrypto;

create type public.user_role as enum ('farmer', 'vet', 'admin', 'agri-supplier');
create type public.payment_state as enum ('pending', 'completed', 'failed');
create type public.order_state as enum ('pending', 'processing', 'allocated', 'fetched_by_vet', 'completed', 'cancelled');

-- `id` is intentionally the Supabase Auth UUID. This replaces SQLite's users.password.
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique check (username ~ '^[A-Za-z0-9_.-]{3,64}$'),
  role public.user_role not null default 'farmer',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.farmers (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null, phone_number text not null,
  latitude double precision, longitude double precision,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (latitude between -90 and 90), check (longitude between -180 and 180)
);
create table public.agri_suppliers (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  business_name text not null, phone_number text not null, address text not null,
  latitude double precision, longitude double precision,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (latitude between -90 and 90), check (longitude between -180 and 180)
);
create table public.bulls (
  id bigint generated always as identity primary key,
  name text not null, breed text not null, registration_number text unique,
  date_of_birth date, sire text, dam text,
  milk_yield numeric(10,2), butterfat_percent numeric(5,2), protein_percent numeric(5,2),
  calving_ease numeric(10,2), fertility_index numeric(10,2), tpi numeric(12,2), scs numeric(10,2),
  semen_price numeric(12,2) not null check (semen_price >= 0),
  stock_available integer not null default 0 check (stock_available >= 0),
  image_url text, certificate_url text,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.vets (
  id bigint generated always as identity primary key,
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null, phone_number text not null, county text not null, sub_county text not null,
  latitude double precision, longitude double precision,
  service_radius_km numeric(10,2) check (service_radius_km >= 0),
  service_fee numeric(12,2) check (service_fee >= 0), certificate_url text,
  verified boolean not null default false, rating numeric(3,2) not null default 0 check (rating between 0 and 5),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (latitude between -90 and 90), check (longitude between -180 and 180)
);
create table public.carts (
  id bigint generated always as identity primary key,
  farmer_id uuid not null references public.users(id) on delete cascade,
  bull_id bigint not null references public.bulls(id) on delete cascade,
  quantity integer not null default 1 check (quantity > 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique (farmer_id, bull_id)
);
create table public.orders (
  id bigint generated always as identity primary key,
  farmer_id uuid not null references public.users(id) on delete cascade,
  vet_id bigint references public.vets(id) on delete set null,
  agri_supplier_id bigint references public.agri_suppliers(id) on delete set null,
  delivery_lat double precision, delivery_lng double precision,
  total_amount numeric(12,2) not null check (total_amount >= 0),
  payment_status public.payment_state not null default 'pending',
  order_status public.order_state not null default 'pending',
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  check (delivery_lat between -90 and 90), check (delivery_lng between -180 and 180)
);
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders(id) on delete cascade,
  bull_id bigint not null references public.bulls(id) on delete restrict,
  quantity integer not null check (quantity > 0), unit_price numeric(12,2) not null check (unit_price >= 0),
  created_at timestamptz not null default now(), unique(order_id, bull_id)
);
create table public.agri_supplier_inventory (
  id bigint generated always as identity primary key,
  agri_supplier_id bigint not null references public.agri_suppliers(id) on delete cascade,
  bull_id bigint not null references public.bulls(id) on delete cascade,
  quantity integer not null default 0 check (quantity >= 0),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(),
  unique(agri_supplier_id, bull_id)
);

create index bulls_breed_idx on public.bulls (breed);
create index bulls_catalog_filter_idx on public.bulls (breed, semen_price);
create index vets_county_verified_idx on public.vets (county, verified);
create index carts_farmer_idx on public.carts (farmer_id);
create index orders_farmer_created_idx on public.orders (farmer_id, created_at desc);
create index orders_vet_created_idx on public.orders (vet_id, created_at desc) where vet_id is not null;
create index orders_supplier_created_idx on public.orders (agri_supplier_id, created_at desc) where agri_supplier_id is not null;
create index order_items_order_idx on public.order_items (order_id);
create index inventory_supplier_idx on public.agri_supplier_inventory (agri_supplier_id);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;
create trigger users_updated before update on public.users for each row execute function public.set_updated_at();
create trigger farmers_updated before update on public.farmers for each row execute function public.set_updated_at();
create trigger suppliers_updated before update on public.agri_suppliers for each row execute function public.set_updated_at();
create trigger bulls_updated before update on public.bulls for each row execute function public.set_updated_at();
create trigger vets_updated before update on public.vets for each row execute function public.set_updated_at();
create trigger carts_updated before update on public.carts for each row execute function public.set_updated_at();
create trigger orders_updated before update on public.orders for each row execute function public.set_updated_at();
create trigger inventory_updated before update on public.agri_supplier_inventory for each row execute function public.set_updated_at();

-- Auth signup atomically creates the application profile. The client cannot self-create admins.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
declare requested_role public.user_role;
begin
  requested_role := coalesce((new.raw_user_meta_data->>'role')::public.user_role, 'farmer');
  if requested_role = 'admin' then requested_role := 'farmer'; end if;
  insert into public.users(id, username, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)), requested_role);
  return new;
end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_admin() returns boolean language sql stable security definer set search_path = public as $$
  select exists(select 1 from public.users where id = auth.uid() and role = 'admin');
$$;

-- Checkout is a single transaction, avoiding partial orders / lost cart contents.
create or replace function public.checkout_cart(p_vet_id bigint, p_supplier_id bigint, p_lat double precision, p_lng double precision)
returns bigint language plpgsql security definer set search_path = public as $$
declare v_order_id bigint; v_total numeric(12,2); v_status public.order_state;
begin
  if not exists(select 1 from public.users where id=auth.uid() and role='farmer') then raise exception 'Only farmers can checkout'; end if;
  select coalesce(sum(c.quantity*b.semen_price), 0) into v_total from public.carts c join public.bulls b on b.id=c.bull_id where c.farmer_id=auth.uid();
  if v_total = 0 then raise exception 'Cart is empty'; end if;
  v_status := case when p_vet_id is null then 'pending' else 'allocated' end;
  insert into public.orders(farmer_id,vet_id,agri_supplier_id,delivery_lat,delivery_lng,total_amount,order_status)
  values(auth.uid(),p_vet_id,p_supplier_id,p_lat,p_lng,v_total,v_status) returning id into v_order_id;
  insert into public.order_items(order_id,bull_id,quantity,unit_price)
  select v_order_id,c.bull_id,c.quantity,b.semen_price from public.carts c join public.bulls b on b.id=c.bull_id where c.farmer_id=auth.uid();
  delete from public.carts where farmer_id=auth.uid();
  return v_order_id;
end; $$;

-- RLS: all browser access is scoped to auth.uid(); server service-role access bypasses these policies.
alter table public.users enable row level security; alter table public.farmers enable row level security;
alter table public.agri_suppliers enable row level security; alter table public.bulls enable row level security;
alter table public.vets enable row level security; alter table public.carts enable row level security;
alter table public.orders enable row level security; alter table public.order_items enable row level security;
alter table public.agri_supplier_inventory enable row level security;
create policy users_read_own on public.users for select using (id=auth.uid() or public.is_admin());
create policy farmers_own on public.farmers for all using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy suppliers_read on public.agri_suppliers for select using (true);
create policy suppliers_own on public.agri_suppliers for all using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy bulls_read on public.bulls for select using (true);
create policy bulls_admin_write on public.bulls for all using (public.is_admin()) with check (public.is_admin());
create policy vets_read on public.vets for select using (true);
create policy vets_own_or_admin on public.vets for all using (user_id=auth.uid() or public.is_admin()) with check (user_id=auth.uid() or public.is_admin());
create policy carts_own on public.carts for all using (farmer_id=auth.uid()) with check (farmer_id=auth.uid());
create policy orders_read on public.orders for select using (farmer_id=auth.uid() or vet_id in (select id from public.vets where user_id=auth.uid()) or agri_supplier_id in (select id from public.agri_suppliers where user_id=auth.uid()) or public.is_admin());
create policy orders_farmer_insert on public.orders for insert with check (farmer_id=auth.uid());
create policy orders_staff_update on public.orders for update using (vet_id in (select id from public.vets where user_id=auth.uid()) or agri_supplier_id in (select id from public.agri_suppliers where user_id=auth.uid()) or public.is_admin());
create policy items_read on public.order_items for select using (order_id in (select id from public.orders));
create policy inventory_read on public.agri_supplier_inventory for select using (true);
create policy inventory_own on public.agri_supplier_inventory for all using (agri_supplier_id in (select id from public.agri_suppliers where user_id=auth.uid()) or public.is_admin()) with check (agri_supplier_id in (select id from public.agri_suppliers where user_id=auth.uid()) or public.is_admin());

insert into storage.buckets (id, name, public) values
 ('bull-images','bull-images',true), ('vet-certificates','vet-certificates',false), ('supplier-documents','supplier-documents',false)
on conflict (id) do nothing;
create policy bull_images_public_read on storage.objects for select using (bucket_id='bull-images');
create policy bull_images_admin_write on storage.objects for all using (bucket_id='bull-images' and public.is_admin()) with check (bucket_id='bull-images' and public.is_admin());
create policy vet_docs_own on storage.objects for all using (bucket_id='vet-certificates' and owner_id=auth.uid()) with check (bucket_id='vet-certificates' and owner_id=auth.uid());
create policy supplier_docs_own on storage.objects for all using (bucket_id='supplier-documents' and owner_id=auth.uid()) with check (bucket_id='supplier-documents' and owner_id=auth.uid());
