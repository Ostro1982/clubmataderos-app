-- Multi-barrio: marca paraguas "Acá a la Vuelta", Mataderos es el primer barrio

create table if not exists barrios (
  id text primary key,            -- slug: mataderos, flores, ...
  nombre text not null,           -- "Mataderos"
  ciudad text not null default 'CABA',
  lat double precision,
  lng double precision,
  activo boolean not null default true,
  created_at timestamptz not null default now()
);

insert into barrios (id, nombre, ciudad, lat, lng) values
  ('mataderos', 'Mataderos', 'CABA', -34.6585, -58.5060)
on conflict (id) do nothing;

-- Scope de comercios y promos por barrio
alter table comercios add column if not exists barrio_id text references barrios(id);
alter table promos    add column if not exists barrio_id text references barrios(id);

update comercios set barrio_id = 'mataderos' where barrio_id is null;
update promos    set barrio_id = 'mataderos' where barrio_id is null;

create index if not exists idx_comercios_barrio on comercios(barrio_id);
create index if not exists idx_promos_barrio on promos(barrio_id);

-- Descuentos bancarios: ámbito (se muestran en todos los barrios segun alcance)
alter table descuentos_bancarios add column if not exists ambito text not null default 'nacional'; -- nacional / caba / pba

alter table barrios enable row level security;
create policy "barrios lectura publica" on barrios for select using (true);
grant select on barrios to anon, authenticated;
