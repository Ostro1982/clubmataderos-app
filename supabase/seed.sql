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

-- Bancos
insert into bancos (id, nombre, color) values
  ('galicia', 'Banco Galicia', '#ff7a00'),
  ('nacion', 'Banco Nación', '#1b4a9c'),
  ('provincia', 'Banco Provincia', '#00a04a'),
  ('bbva', 'BBVA', '#1464a5'),
  ('santander', 'Santander', '#ec0000'),
  ('macro', 'Banco Macro', '#0072ce')
on conflict (id) do nothing;

-- Descuentos bancarios (relevamiento 2026-06-19, fuentes oficiales + agregadores)
insert into descuentos_bancarios (banco_id, titulo, rubro, dias, porcentaje, tope, medio_pago, condiciones, url_fuente, confianza, verificado_at) values
  ('galicia','15% en combustible','Combustible',array['lunes'],15,'$15.000/mes Eminent, $10.000/mes general','Mastercard Galicia vía MODO','15% Eminent / 10% general. Estaciones adheridas, un pago.','https://www.galicia.ar/personas/promociones/promocion-combustible','media','2026-06-19'),
  ('galicia','25% en farmacia (FarmaPlus)','Farmacia',array['jueves'],25,'Compras > $40.000','Visa/Mastercard Galicia','Vigencia 21/05 al 31/08/2026. 25% reintegro.','https://www.galicia.ar/personas/promociones','media','2026-06-19'),
  ('galicia','Hasta 30% en super (Coto Digital)','Supermercados',array['jueves'],30,'$20.000/mes Eminent, $15.000/mes general','American Express Galicia','30% Eminent / 25% general. Requiere caja de ahorro. Solo Coto Digital.','https://descuentazo.com.ar/bancos/galicia-2','media','2026-06-19'),
  ('galicia','Hasta 25% en cervecerías','Gastronomía',array['jueves'],25,'$25.000/mes Eminent, $20.000/mes general','Visa Galicia vía MODO','25% Eminent / 20% general. Cervecería Patagonia.','https://descuentazo.com.ar/bancos/galicia-2','media','2026-06-19'),
  ('galicia','Hasta 25% en Uber','Transporte',array['miercoles','jueves'],25,'$4.000/mes','Visa/Mastercard/Amex Galicia y débito','25% Eminent / 20% general.','https://descuentazo.com.ar/bancos/galicia-2','media','2026-06-19'),

  ('nacion','30% en supermercados y mayoristas','Supermercados',array['miercoles'],30,'$12.000 por semana','MODO BNA+ con Visa/Mastercard crédito','Escaneo QR en comercios adheridos. Verificar prórroga de vigencia.','https://www.bna.com.ar/Personas/DescuentosYPromociones','media','2026-06-19'),
  ('nacion','20% en ChangoMás','Supermercados',array['lunes'],20,'$25.000 reintegro, mínimo $75.000','MODO BNA+','Solo ChangoMás.','https://www.bna.com.ar/Personas/DescuentosYPromociones','media','2026-06-19'),
  ('nacion','20% en mayorista Nini','Supermercados',array['jueves'],20,'$20.000 reintegro','MODO BNA+','Solo Mayorista Nini, sin mínimo.','https://www.bna.com.ar/Personas/DescuentosYPromociones','media','2026-06-19'),
  ('nacion','20% en combustible','Combustible',array['viernes'],20,'$10.000/mes (+5% Shell)','MODO BNA+ con Visa/Mastercard','YPF, Axion, Shell, Dapsa, Gulf. Pago QR.','https://www.bna.com.ar/Personas/DescuentosYPromociones','media','2026-06-19'),
  ('nacion','25% en super El Nene','Supermercados',array['lunes','jueves'],25,'$12.000 por mes','Tarjetas BNA','Solo Supermercado El Nene.','https://www.bna.com.ar/Personas/DescuentosYPromociones','media','2026-06-19'),

  ('provincia','20% en comercios de cercanía','Supermercados',array['lunes','martes','miercoles','jueves','viernes'],20,'$6.000 por semana','Cuenta DNI (QR/Clave DNI)','Carnicerías, verdulerías, pescaderías adheridas (PBA), lun a vie.','https://cuentadni.gba.gob.ar','media','2026-06-19'),
  ('provincia','25% en gastronomía','Gastronomía',array['sabado','domingo'],25,'$8.000 por semana','Cuenta DNI (QR/Clave DNI)','Locales gastronómicos adheridos, fin de semana.','https://cuentadni.gba.gob.ar','media','2026-06-19'),
  ('provincia','20% en ChangoMás','Supermercados',array['jueves'],20,null,'Cuenta DNI (QR/Clave DNI)','Cadena ChangoMás, los jueves.','https://cuentadni.gba.gob.ar','media','2026-06-19'),
  ('provincia','30% en COTO','Supermercados',array['jueves'],30,null,'Cuenta DNI (pago NFC)','COTO los jueves pagando con NFC desde la app.','https://cuentadni.gba.gob.ar','media','2026-06-19'),
  ('provincia','15% en mayorista Nini','Supermercados',array['martes'],15,null,'Cuenta DNI (QR/Clave DNI)','Nini Mayorista, los martes.','https://cuentadni.gba.gob.ar','media','2026-06-19'),
  ('provincia','25% en combustible YPF Full','Combustible',array['sabado','domingo'],25,'$8.000 por semana','Cuenta DNI (QR/Clave DNI)','Estaciones YPF Full adheridas, fin de semana.','https://cuentadni.gba.gob.ar','media','2026-06-19'),

  ('bbva','30% en gastronomía y heladerías','Gastronomía',array['martes','viernes'],30,'$12.000 por mes','Crédito BBVA vía MODO/QR Openpay','Restaurantes y heladerías adheridos. Vigencia hasta 30/06/2026.','https://www.bbva.com.ar/beneficios','media','2026-06-19'),
  ('bbva','20% en combustible Axion','Combustible',array['sabado'],20,'$6.000 por mes','Crédito BBVA (QR MODO)','Requiere cuenta sueldo BBVA y registro en ON Axion.','https://www.bbva.com.ar/beneficios','media','2026-06-19'),
  ('bbva','30% cuenta sueldo (super/combustible)','Supermercados',array['sabado','domingo'],30,'$10.000 por semana','Crédito BBVA','Solo cuenta sueldo BBVA. Verificar días por rubro en el portal.','https://www.bbva.com.ar/beneficios','baja','2026-06-19'),

  ('santander','25% en DIA','Supermercados',array['miercoles'],25,'$20.000 por mes','MODO App Santander / Visa','Sucursales DIA adheridas.','https://www.santander.com.ar/banco/online/personas/beneficios','media','2026-06-19'),
  ('santander','25% en Carrefour','Supermercados',array['viernes'],25,'$20.000 por mes','MODO App Santander / Visa','Carrefour adheridos.','https://www.santander.com.ar/banco/online/personas/beneficios','media','2026-06-19'),
  ('santander','25% en ChangoMás','Supermercados',array['jueves'],25,'$20.000 por mes','MODO App Santander / Visa','Solo suscriptores Santander Sorpresa.','https://www.santander.com.ar/banco/online/personas/beneficios','media','2026-06-19'),
  ('santander','25% en Disco/Jumbo/Vea','Supermercados',array['miercoles'],25,'$20.000 por mes','Visa débito o crédito','Clientes con acreditación de haberes.','https://www.santander.com.ar/banco/online/personas/beneficios','media','2026-06-19'),

  ('macro','30% en YPF (Selecta)','Combustible',array['martes'],30,'$25.000 por mes','MODO App Macro (tarjetas Selecta)','Solo clientes Macro Selecta. Pago presencial en YPF.','https://www.macro.com.ar/selecta','media','2026-06-19'),
  ('macro','20% en YPF (Macro)','Combustible',array['martes'],20,'$15.000 por mes','MODO App Macro / Visa Platinum','Clientes Macro registrados en MODO. YPF adheridas.','https://www.modo.com.ar/promos','media','2026-06-19'),
  ('macro','30% Sábados Selecta (gastronomía)','Gastronomía',array['sabado'],30,'$20.000 por mes por rubro','MODO App Macro (tarjetas Selecta)','Solo Macro Selecta. Desayunos/almuerzos 7-15hs, cines, peluquerías. Vigencia hasta 30/06/2026.','https://www.macro.com.ar/selecta/sabados','alta','2026-06-19'),
  ('macro','25% en Hiper Libertad','Supermercados',array['miercoles'],25,'$20.000','MODO App Macro','Compras online en Libertad. Verificar continuidad en junio.','https://www.macro.com.ar/selecta','baja','2026-06-19')
on conflict do nothing;
