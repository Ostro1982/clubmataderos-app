# Refresh de datos — Acá a la Vuelta

## Comercios (por barrio)
Fuente: OpenStreetMap vía Overpass (gratis, sin API key).
1. `python supabase/fetch_comercios.py` → baja comercios reales del bbox del barrio a `D:\temp\comercios_mataderos.json`.
2. `python supabase/load_comercios_cloud.py` → cura y carga al cloud (barrio mataderos).
Para otro barrio: cambiar `BBOX` y `barrio_id`.

## Descuentos bancarios / tarjetas / programas
Las grillas cambian MES A MES y muchas vencen fin de mes. NO hay scraper automático confiable
(los sitios de Clarín 365 / Club LN / bancos son JS pesado, anti-bot, y ToS gris).

Proceso de refresh manual (recomendado a principios de cada mes):
1. Correr un relevamiento (agente de investigación o a mano) sobre las fuentes oficiales + agregadores
   (descuentos.clarin.com, club.lanacion.com.ar, descuentazo, MODO, sitios de cada banco).
2. Actualizar los datos en `supabase/seed_cloud.py` (6 bancos base) y `supabase/load_entidades_cloud.py`
   (13 entidades), con su `verificado_at`, `confianza` y `url_fuente`.
3. `python supabase/seed_cloud.py` y `python supabase/load_entidades_cloud.py` (usan upsert por merge-duplicates).
4. Para desactivar viejas: marcar `activo=false` o borrar las vencidas.

### Futuro (fase aparte)
Automatizar con un job semanal (GitHub Actions) que corra el relevamiento y cargue.
Realista: requiere mantenimiento (los selectores se rompen). No es mágico.

## Estado actual
- Relevamiento: 2026-06-23. 19 entidades, ~59 descuentos. Confianza mayormente "media" (badge visible en la app).
