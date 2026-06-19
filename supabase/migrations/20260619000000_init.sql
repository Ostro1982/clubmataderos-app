-- Club Mataderos — schema inicial MVP

create table if not exists comercios (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  rubro text not null default '',
  direccion text not null default '',
  lat double precision,
  lng double precision,
  logo_url text,
  telefono text,
  created_at timestamptz not null default now()
);

create table if not exists promos (
  id uuid primary key default gen_random_uuid(),
  comercio_id uuid not null references comercios(id) on delete cascade,
  titulo text not null,
  descripcion text,
  descuento text,
  foto_url text,
  vigencia_desde date,
  vigencia_hasta date,
  limite_canjes integer,
  activa boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists canjes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  promo_id uuid not null references promos(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, promo_id)
);

create index if not exists idx_promos_comercio on promos(comercio_id);
create index if not exists idx_canjes_user on canjes(user_id);

-- RLS
alter table comercios enable row level security;
alter table promos enable row level security;
alter table canjes enable row level security;

-- Lectura pública de comercios y promos
create policy "comercios lectura publica" on comercios
  for select using (true);

create policy "promos lectura publica" on promos
  for select using (true);

-- Canjes: el usuario sólo ve e inserta los propios
create policy "canjes select propios" on canjes
  for select using (auth.uid() = user_id);

create policy "canjes insert propios" on canjes
  for insert with check (auth.uid() = user_id);

-- Grants a nivel tabla (RLS controla filas, GRANT controla acceso al rol)
grant select on comercios to anon, authenticated;
grant select on promos to anon, authenticated;
grant select, insert on canjes to authenticated;
