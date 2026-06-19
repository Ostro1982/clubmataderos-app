-- Descuentos bancarios (curado por admin, usuario consulta/filtra)

create table if not exists bancos (
  id text primary key,            -- slug: galicia, nacion, provincia, bbva, santander, macro
  nombre text not null,
  color text not null default '#666666',
  created_at timestamptz not null default now()
);

create table if not exists descuentos_bancarios (
  id uuid primary key default gen_random_uuid(),
  banco_id text not null references bancos(id) on delete cascade,
  titulo text not null,
  rubro text not null default '',
  dias text[] not null default '{}',          -- lunes..domingo
  porcentaje integer,
  tope text,
  medio_pago text,
  condiciones text,
  url_fuente text,
  confianza text not null default 'media',     -- alta / media / baja
  verificado_at date,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists idx_desc_banco on descuentos_bancarios(banco_id);

alter table bancos enable row level security;
alter table descuentos_bancarios enable row level security;

create policy "bancos lectura publica" on bancos for select using (true);
create policy "descuentos lectura publica" on descuentos_bancarios for select using (true);

grant select on bancos to anon, authenticated;
grant select on descuentos_bancarios to anon, authenticated;
