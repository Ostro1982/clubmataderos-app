# -*- coding: utf-8 -*-
# Curar comercios OSM y cargarlos al cloud (barrio mataderos). Reasigna promos demo a reales, borra falsos.
import json, urllib.request

BASE = "https://pilshmwslrhcizujlemg.supabase.co/rest/v1"
SVC = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbHNobXdzbHJoY2l6dWpsZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg3MjY0MSwiZXhwIjoyMDk3NDQ4NjQxfQ.YBUAoDFLYLU5VKQwGpj34ZHk--9TBkTcIpDYombMfZQ"
H = {"apikey": SVC, "Authorization": f"Bearer {SVC}", "Content-Type": "application/json"}

def req(method, path, body=None, prefer=None):
    h = dict(H)
    if prefer: h["Prefer"] = prefer
    data = json.dumps(body).encode("utf-8") if body is not None else None
    r = urllib.request.Request(f"{BASE}/{path}", data=data, method=method, headers=h)
    with urllib.request.urlopen(r) as resp:
        txt = resp.read().decode("utf-8")
        return resp.status, (json.loads(txt) if txt.strip() else None)

EXCLUIR = {"Estate_agent","Car_parts","Car_repair","Car","Motorcycle","Tyres","Funeral_directors",
           "Money_lender","Religion","Weapons","E-cigarette","Printer_ink","Mall","Food","Craft",
           "Flooring","Interior_decoration","Locksmith","Cannabis","Tattoo"}
RENOMBRA = {"Yes":"Comercio","Optician":"Óptica","Florist":"Florería","Pet":"Mascotas","Toys":"Juguetería",
            "Sports":"Deportes","Books":"Librería","Stationery":"Librería","Health_food":"Dietética",
            "Cheese":"Fiambrería","Perfumery":"Perfumería","Variety_store":"Bazar","Houseware":"Bazar",
            "Laundry":"Lavadero","Bicycle":"Bicicletería","Music":"Música","Gift":"Regalería","Photo":"Fotografía",
            "Copyshop":"Fotocopias","Pasta":"Pastas","Seafood":"Pescadería","Spices":"Especias","Beverages":"Bebidas",
            "Fabric":"Telas","Furniture":"Muebles","Bed":"Colchones","Lighting":"Iluminación","Party":"Cotillón",
            "Household_linen":"Blanco","Electrical":"Electricidad","Fashion_accessories":"Accesorios",
            "Pet_grooming":"Mascotas","Hardware":"Ferretería"}
PREF = ["Gastronomía","Almacén y super","Panadería","Salud","Belleza","Kiosco","Indumentaria","Fiambrería","Dietética"]

comercios = json.load(open(r"D:\temp\comercios_mataderos.json", encoding="utf-8"))
cur = []
for c in comercios:
    rub = c["rubro"]
    if rub in EXCLUIR:
        continue
    c["rubro"] = RENOMBRA.get(rub, rub)
    c["barrio_id"] = "mataderos"
    cur.append(c)

# Prioridad: con direccion + rubro preferido
def score(c):
    return (0 if c["direccion"] else 1, PREF.index(c["rubro"]) if c["rubro"] in PREF else 99, c["nombre"])
cur.sort(key=score)
cur = cur[:80]

# Insertar comercios reales (devuelve ids)
st, ins = req("POST", "comercios", cur, prefer="return=representation")
print("comercios insertados:", st, len(ins))

# Indexar por rubro
por_rubro = {}
for row in ins:
    por_rubro.setdefault(row["rubro"], []).append(row["id"])

def pick(rubro, fallbacks, used):
    for r in [rubro] + fallbacks:
        for cid in por_rubro.get(r, []):
            if cid not in used:
                used.add(cid)
                return cid
    return ins[0]["id"]

used = set()
plan = {
    "aaaaaaaa-0000-0000-0000-000000000001": ("Gastronomía", []),
    "aaaaaaaa-0000-0000-0000-000000000002": ("Gastronomía", ["Panadería"]),
    "aaaaaaaa-0000-0000-0000-000000000003": ("Salud", ["Perfumería"]),
    "aaaaaaaa-0000-0000-0000-000000000004": ("Kiosco", ["Almacén y super"]),
    "aaaaaaaa-0000-0000-0000-000000000005": ("Belleza", []),
    "aaaaaaaa-0000-0000-0000-000000000006": ("Gastronomía", ["Dietética"]),
}
for promo_id, (rub, fb) in plan.items():
    cid = pick(rub, fb, used)
    st, _ = req("PATCH", f"promos?id=eq.{promo_id}", {"comercio_id": cid, "barrio_id": "mataderos"}, prefer="return=minimal")
    print(f"promo {promo_id[-4:]} -> comercio {cid[:8]} ({rub}) [{st}]")

# Borrar comercios falsos
fakes = ["11111111-1111-1111-1111-111111111111","22222222-2222-2222-2222-222222222222",
         "33333333-3333-3333-3333-333333333333","44444444-4444-4444-4444-444444444444",
         "55555555-5555-5555-5555-555555555555"]
st, _ = req("DELETE", "comercios?id=in.(" + ",".join(fakes) + ")", prefer="return=minimal")
print("borrado falsos:", st)

# Verificar
st, tot = req("GET", "comercios?select=id&barrio_id=eq.mataderos", prefer="count=exact")
print("VERIFY comercios mataderos:", len(tot))
