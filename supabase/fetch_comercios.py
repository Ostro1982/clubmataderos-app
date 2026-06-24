# -*- coding: utf-8 -*-
# Trae comercios reales de Mataderos desde OpenStreetMap (Overpass API). Sin API key.
import json, urllib.request, urllib.parse

# Bounding box aproximado de Mataderos (S,W,N,E)
BBOX = "-34.678,-58.530,-34.640,-58.495"

QUERY = f"""
[out:json][timeout:60];
(
  node["shop"]["name"]({BBOX});
  node["amenity"~"^(restaurant|cafe|fast_food|bar|pharmacy|ice_cream|pub)$"]["name"]({BBOX});
  way["shop"]["name"]({BBOX});
  way["amenity"~"^(restaurant|cafe|fast_food|bar|pharmacy|ice_cream|pub)$"]["name"]({BBOX});
);
out center 400;
"""

def rubro_de(tags):
    shop = tags.get("shop", "")
    am = tags.get("amenity", "")
    if am in ("restaurant", "cafe", "fast_food", "bar", "ice_cream", "pub") or shop in ("bakery", "confectionery", "pastry"):
        return "Gastronomía"
    if am == "pharmacy" or shop in ("chemist", "medical_supply"):
        return "Salud"
    if shop in ("hairdresser", "beauty", "cosmetics"):
        return "Belleza"
    if shop in ("supermarket", "convenience", "greengrocer", "butcher", "deli", "general", "frozen_food", "dairy"):
        return "Almacén y super"
    if shop in ("clothes", "shoes", "boutique", "fashion", "bag", "jewelry"):
        return "Indumentaria"
    if shop in ("hardware", "doityourself", "paint", "trade"):
        return "Ferretería"
    if shop in ("bakery",):
        return "Panadería"
    if shop in ("kiosk", "newsagent", "tobacco"):
        return "Kiosco"
    if shop in ("electronics", "mobile_phone", "computer", "hifi"):
        return "Electro"
    if shop:
        return shop.capitalize()
    return "Comercio"

def dir_de(tags):
    calle = tags.get("addr:street", "")
    num = tags.get("addr:housenumber", "")
    if calle and num:
        return f"{calle} {num}"
    return calle or ""

ENDPOINTS = [
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
]
data = urllib.parse.urlencode({"data": QUERY}).encode()
res = None
import time
for ep in ENDPOINTS:
    for intento in range(2):
        try:
            req = urllib.request.Request(ep, data=data, headers={"User-Agent": "acalavuelta-dev/1.0"})
            with urllib.request.urlopen(req, timeout=90) as r:
                res = json.load(r)
            print("OK via", ep)
            break
        except Exception as e:
            print(f"fallo {ep} intento {intento+1}: {e}")
            time.sleep(3)
    if res:
        break
if not res:
    raise SystemExit("Todos los endpoints fallaron")

vistos = set()
comercios = []
for el in res.get("elements", []):
    tags = el.get("tags", {})
    nombre = tags.get("name", "").strip()
    if not nombre or nombre.lower() in vistos:
        continue
    if el["type"] == "node":
        lat, lng = el.get("lat"), el.get("lon")
    else:
        c = el.get("center", {})
        lat, lng = c.get("lat"), c.get("lon")
    if lat is None:
        continue
    vistos.add(nombre.lower())
    comercios.append({
        "nombre": nombre,
        "rubro": rubro_de(tags),
        "direccion": dir_de(tags),
        "lat": round(lat, 6),
        "lng": round(lng, 6),
        "telefono": tags.get("phone") or tags.get("contact:phone") or None,
    })

# Orden: primero los que tienen direccion, por rubro
comercios.sort(key=lambda c: (c["direccion"] == "", c["rubro"], c["nombre"]))

with open(r"D:\temp\comercios_mataderos.json", "w", encoding="utf-8") as f:
    json.dump(comercios, f, ensure_ascii=False, indent=1)

print("TOTAL:", len(comercios))
from collections import Counter
for rub, n in Counter(c["rubro"] for c in comercios).most_common():
    print(f"  {rub}: {n}")
print("--- muestra ---")
for c in comercios[:12]:
    print(f"  {c['nombre']} | {c['rubro']} | {c['direccion']} | {c['lat']},{c['lng']}")
