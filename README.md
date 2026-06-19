# Club Mataderos — app

Plataforma hiperlocal de promos/cupones (barrio Mataderos). Reconstrucción greenfield con Andrés.
Stack: React + Vite + TypeScript + Tailwind (PWA) · Supabase local (Postgres + Auth).

## Levantar todo

Requiere Docker Desktop corriendo.

```bash
cd C:\Users\Ostro\clubmataderos-app
npx supabase start        # backend local (Postgres, Auth, Studio)
npm run dev               # frontend en http://localhost:5173
```

- App: http://localhost:5173
- Supabase Studio (ver/editar datos): http://localhost:54323
- Mailpit (mails de auth/confirmación): http://localhost:54324

Reaplicar schema + datos de ejemplo:
```bash
npx supabase db reset
```

Parar backend:
```bash
npx supabase stop
```

## Probar el canje (QR)
1. Abrí `qr-test.html` en el navegador (QR de las promos de ejemplo).
2. En la app, registrate (tab Ingresar) — mail/clave, no requiere confirmación en local.
3. Tab Escanear → apuntá la cámara a un QR → queda el canje en "Mis canjes".

Nota: la cámara web sólo funciona en `localhost` o HTTPS. Para probar en el celular real
hace falta deploy con HTTPS (o un túnel). En la compu funciona con webcam.

## Estructura
- `src/pages/` — Home (promos), PromoDetalle, Mapa, Escanear, MisCanjes, Login
- `src/lib/` — supabase client, auth
- `supabase/migrations/` — schema
- `supabase/seed.sql` — comercios y promos de ejemplo

## Pendiente / roadmap
- Deploy: dominio clubmataderos.com.ar + Supabase cloud (necesita login de Diego) + Cloudflare/Vercel.
- Push notifications (OneSignal web / web push).
- Panel para que el comercio cargue sus propias promos.
- PWA installable (manifest + service worker).
- Roadmap Clash: micrositios, analytics por comercio, límites de uso en tiempo real.
