# -*- coding: utf-8 -*-
# Carga entidades nuevas (bancos/fintech/programas) + sus descuentos al cloud. Relevamiento 2026-06-23.
import json, urllib.request

BASE = "https://pilshmwslrhcizujlemg.supabase.co/rest/v1"
SVC = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbHNobXdzbHJoY2l6dWpsZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg3MjY0MSwiZXhwIjoyMDk3NDQ4NjQxfQ.YBUAoDFLYLU5VKQwGpj34ZHk--9TBkTcIpDYombMfZQ"
H = {"apikey": SVC, "Authorization": f"Bearer {SVC}", "Content-Type": "application/json",
     "Prefer": "resolution=merge-duplicates,return=minimal"}

def post(path, rows):
    data = json.dumps(rows).encode("utf-8")
    r = urllib.request.Request(f"{BASE}/{path}", data=data, method="POST", headers=H)
    with urllib.request.urlopen(r) as resp:
        return resp.status

V = "2026-06-23"
# slug, nombre, color
ENT = [
    ("icbc","ICBC","#c8102e"),
    ("ciudad","Banco Ciudad","#00a3e0"),
    ("supervielle","Supervielle","#00b2a9"),
    ("credicoop","Credicoop","#008c44"),
    ("comafi","Comafi","#e2231a"),
    ("patagonia","Banco Patagonia","#00843d"),
    ("brubank","Brubank","#6c2bd9"),
    ("naranjax","Naranja X","#ff5000"),
    ("uala","Ualá","#5a2d82"),
    ("mercadopago","Mercado Pago","#00b1ea"),
    ("personalpay","Personal Pay","#5f259f"),
    ("clarin365","Clarín 365","#d52b1e"),
    ("clublanacion","Club LA NACION","#0046ad"),
]
bancos = [{"id": s, "nombre": n, "color": c} for s, n, c in ENT]

def d(b, t, r, dias, p, tope, medio, cond, url, amb, conf):
    return {"banco_id": b, "titulo": t, "rubro": r, "dias": dias, "porcentaje": p, "tope": tope,
            "medio_pago": medio, "condiciones": cond, "url_fuente": url, "ambito": amb,
            "confianza": conf, "verificado_at": V, "activo": True}

desc = [
    d("icbc","20% en Supermercados Día","Supermercados",["viernes"],20,"$20.000 por tarjeta ($40.000 familia)","Visa ICBC (NFC/MODO)","1 pago; débito vía NFC","https://www.beneficios.icbc.com.ar/","nacional","alta"),
    d("icbc","30% en Coto con débito Visa","Supermercados",["jueves"],30,"sin tope","Débito Visa ICBC (NFC/MODO)","CABA/GBA y otras provincias. Verificar vigencia.","https://www.beneficios.icbc.com.ar/","nacional","media"),
    d("icbc","30% en Coto Digital","Supermercados",["lunes"],30,"$15.000 (sueldo) / $10.000 (resto)","Tarjetas Visa ICBC","Compras online en Coto Digital","https://www.beneficios.icbc.com.ar/","nacional","media"),

    d("ciudad","25% en supermercados","Supermercados",["lunes"],25,"según comercio","Tarjetas Banco Ciudad / app","Cencosud, Coto, ChangoMás, Cordiez, Libertad","https://www.bancociudad.com.ar/beneficios/","caba","alta"),
    d("ciudad","30% en gastronomía","Gastronomía",["miercoles"],30,"según comercio","Tarjetas Banco Ciudad","Club de la Milanesa, Café Martínez, PedidosYa y otros","https://www.bancociudad.com.ar/beneficios/","caba","alta"),
    d("ciudad","15% en combustible","Combustible",["domingo"],15,"según comercio","TC/TD Visa + MODO","10% Visa + 5% adicional con MODO","https://www.bancociudad.com.ar/beneficios/","caba","media"),
    d("ciudad","20% en librerías y jugueterías","Indumentaria",["viernes"],20,"según comercio","Tarjetas Banco Ciudad + MODO","Adheridas; +10% con MODO","https://www.bancociudad.com.ar/beneficios/","caba","media"),

    d("supervielle","20% en supermercados","Supermercados",["martes"],20,"$25.000 (débito) / $15.000 (QR)","Débito Supervielle o QR MODO","Jumbo, Disco, Vea, ChangoMás; cobrando haberes","https://www.supervielle.com.ar/personas/beneficios/descuentos","nacional","alta"),

    d("credicoop","Descuentos en supermercados con Cabal","Supermercados",["miercoles"],50,"$10.000 reintegro","Cabal Débito Credicoop","Vía programa de puntos; día a confirmar en portal","https://www.beneficios.bancocredicoop.coop/","nacional","baja"),

    d("comafi","20% en ChangoMás","Supermercados",["martes"],20,"$12.000 por día","Visa/Mastercard Comafi","Vigente junio 2026","https://www.tevabien.com/","nacional","media"),
    d("comafi","25% en Coto","Supermercados",["jueves"],25,"$12.000 por día","Visa Platinum/Signature Comafi","Solo tarjetas premium","https://www.tevabien.com/","nacional","media"),
    d("comafi","20% en Diarco Mayorista","Supermercados",["lunes","martes","miercoles","jueves","viernes"],20,"$10.000 por semana","Tarjetas Comafi","Lunes a viernes","https://www.tevabien.com/","nacional","media"),

    d("patagonia","20% en combustible","Combustible",["jueves"],20,"$15.000 (sueldo: 25%)","Débito/crédito Patagonia","25% si cobra sueldo en el banco","https://www.bancopatagonia.com.ar/personas/tarjetas/beneficios.php","nacional","media"),
    d("patagonia","30% en peluquerías","Belleza",["miercoles"],30,"según comercio","Tarjetas Patagonia","Comercios rubro peluquerías","https://www.bancopatagonia.com.ar/personas/tarjetas/beneficios.php","nacional","media"),

    d("brubank","30% en Coto","Supermercados",["jueves"],30,"según condiciones","Débito Visa Brubank (NFC)","Sucursales físicas; hasta 30/06/2026","https://help.brubank.com/es/articles/13977196-30-de-descuento-los-jueves-en-supermercados-coto","nacional","alta"),
    d("brubank","20% en Farmacity","Farmacia",["viernes"],20,"según condiciones","Débito Visa Brubank","Sujeto a 'girar la ruedita'","https://www.brubank.com/beneficios","nacional","media"),
    d("brubank","30% en Burger King","Gastronomía",["viernes","sabado","domingo"],30,"según condiciones","Débito/crédito Visa Brubank","Sujeto a 'girar la ruedita'","https://www.brubank.com/beneficios","nacional","media"),

    d("naranjax","25% en supermercados (Plan Turbo)","Supermercados",["martes"],25,"$8.000 por semana","Crédito/débito Naranja X","Jumbo, Disco, Vea, Carrefour, Día, Coto y otros; Plan Turbo","https://www.naranjax.com/promociones/SUPERMERCADOS_categoria","nacional","alta"),
    d("naranjax","30% en supermercados (Plan Épico)","Supermercados",["martes"],30,"$10.000 por semana","Crédito/débito Naranja X","Mismos supermercados; Plan Épico","https://www.naranjax.com/promociones/SUPERMERCADOS_categoria","nacional","alta"),

    d("uala","25% en Coto","Supermercados",["lunes"],25,"$15.000 por mes","Crédito o prepaga Ualá","Pago con tarjeta Ualá","https://www.uala.com.ar/promociones","nacional","alta"),
    d("uala","25% en Jumbo, Vea y Disco","Supermercados",["martes"],25,"$8.000/sem (NFC)","Ualá NFC o tarjeta física","25% con NFC; 15% con tarjeta física","https://www.uala.com.ar/promociones","nacional","alta"),
    d("uala","25% en ChangoMás","Supermercados",["jueves"],25,"$15.000 por mes","Crédito Ualá","Exclusivo tarjeta de crédito","https://www.uala.com.ar/promociones","nacional","alta"),

    d("mercadopago","25% en Coto","Supermercados",["viernes"],25,"sin tope","Mercado Pago (QR)","Pago con QR en Coto","https://promociones.mercadopago.com.ar/","nacional","media"),
    d("mercadopago","15% en Carrefour","Supermercados",["jueves"],15,"sin tope","Mercado Pago (QR)","Pago con QR en Carrefour","https://promociones.mercadopago.com.ar/","nacional","media"),
    d("mercadopago","20% en ChangoMás","Supermercados",["martes"],20,"según condiciones","Mercado Pago (QR)","Pago con QR","https://promociones.mercadopago.com.ar/","nacional","media"),

    d("personalpay","25% en supermercados","Supermercados",["miercoles","jueves"],25,"$6.000 a $15.000/sem según nivel","Personal Pay","Día, Diarco, ChangoMás, Makro, Maxiconsumo y otros","https://www.personalpay.com.ar/","nacional","media"),

    d("clarin365","20% en Disco (locales)","Supermercados",["lunes","martes","miercoles"],20,"según condiciones","Tarjeta 365 / socio JUMBO+","Locales físicos Disco; online 25%","https://descuentos.clarin.com/","nacional","media"),
    d("clarin365","15% en supermercados Cencosud","Supermercados",["miercoles"],15,"según condiciones","Tarjeta 365","Jumbo, Disco, Vea; 20% exclusivo online","https://supermercadosvea.com.ar/alianza/clarin-365/","nacional","media"),
    d("clarin365","Hasta 50% en gastronomía","Gastronomía",["lunes","martes","miercoles","jueves","viernes","sabado","domingo"],50,"según comercio","Tarjeta 365","Comercios gastronómicos adheridos; presentar credencial","https://descuentos.clarin.com/","nacional","media"),

    d("clublanacion","20% en Disco, Vea y Jumbo","Supermercados",["viernes","sabado","domingo"],20,"según condiciones","Credencial Club LA NACION","Socios; presentar credencial","https://club.lanacion.com.ar/beneficios/supermercados/supermercados","nacional","media"),
    d("clublanacion","15% en Coto","Supermercados",["lunes","miercoles"],15,"según condiciones","Credencial Club LA NACION","+20% una vez al mes","https://club.lanacion.com.ar/beneficios/supermercados/supermercados","nacional","media"),
    d("clublanacion","Descuentos en gastronomía","Gastronomía",["lunes","martes","miercoles","jueves","viernes","sabado","domingo"],20,"según comercio","Credencial Club LA NACION","Comercios gastronómicos adheridos","https://club.lanacion.com.ar/beneficios/gastronomia","nacional","media"),
]

print("bancos:", post("bancos", bancos))
print("descuentos:", post("descuentos_bancarios", desc), "filas:", len(desc))
