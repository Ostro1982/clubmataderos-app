-- Seed demo Club Mataderos (comercios y promos de ejemplo, barrio Mataderos CABA)

insert into comercios (id, nombre, rubro, direccion, lat, lng, telefono) values
  ('11111111-1111-1111-1111-111111111111', 'Pizzería El Hornero', 'Gastronomía', 'Av. Juan B. Alberdi 5800', -34.6585, -58.5040, '11-4000-0001'),
  ('22222222-2222-2222-2222-222222222222', 'Farmacia del Parque', 'Salud', 'Av. Directorio 4200', -34.6520, -58.4990, '11-4000-0002'),
  ('33333333-3333-3333-3333-333333333333', 'Kiosco 24hs Mataderos', 'Almacén', 'Av. Eva Perón 6100', -34.6600, -58.5080, '11-4000-0003'),
  ('44444444-4444-4444-4444-444444444444', 'Peluquería Estilo', 'Belleza', 'Saladillo 2300', -34.6630, -58.5050, '11-4000-0004'),
  ('55555555-5555-5555-5555-555555555555', 'Heladería La Esquina', 'Gastronomía', 'Av. Juan B. Alberdi 6200', -34.6610, -58.5110, '11-4000-0005')
on conflict (id) do nothing;

insert into promos (id, comercio_id, titulo, descripcion, descuento, foto_url, vigencia_hasta, limite_canjes, activa) values
  ('aaaaaaaa-0000-0000-0000-000000000001', '11111111-1111-1111-1111-111111111111', '2x1 en pizzas grandes', 'Comprá una pizza grande y llevate la segunda gratis. Lunes a jueves.', '2x1', 'https://picsum.photos/seed/pizza/600/400', '2026-12-31', 100, true),
  ('aaaaaaaa-0000-0000-0000-000000000002', '11111111-1111-1111-1111-111111111111', 'Empanadas docena a $X', 'Docena de empanadas con 20% off presentando el QR.', '20%', 'https://picsum.photos/seed/empanada/600/400', '2026-12-31', null, true),
  ('aaaaaaaa-0000-0000-0000-000000000003', '22222222-2222-2222-2222-222222222222', '15% en perfumería', 'Descuento en toda la línea de perfumería y cuidado personal.', '15%', 'https://picsum.photos/seed/farmacia/600/400', '2026-12-31', null, true),
  ('aaaaaaaa-0000-0000-0000-000000000004', '33333333-3333-3333-3333-333333333333', '10% en golosinas', 'Mostrá el QR y llevate 10% off en golosinas y bebidas.', '10%', 'https://picsum.photos/seed/kiosco/600/400', '2026-12-31', null, true),
  ('aaaaaaaa-0000-0000-0000-000000000005', '44444444-4444-4444-4444-444444444444', 'Corte + barba combo', 'Combo corte y barba con precio especial socios del club.', 'Combo', 'https://picsum.photos/seed/peluqueria/600/400', '2026-12-31', 50, true),
  ('aaaaaaaa-0000-0000-0000-000000000006', '55555555-5555-5555-5555-555555555555', '1/4 kg gratis', 'En la compra de 1 kg de helado, 1/4 kg de regalo.', 'Regalo', 'https://picsum.photos/seed/helado/600/400', '2026-12-31', 200, true)
on conflict (id) do nothing;
