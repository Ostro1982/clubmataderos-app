# Carga bancos + descuentos_bancarios al proyecto Supabase cloud via REST (service_role).
import json, urllib.request

BASE = "https://pilshmwslrhcizujlemg.supabase.co/rest/v1"
SVC = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBpbHNobXdzbHJoY2l6dWpsZW1nIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTg3MjY0MSwiZXhwIjoyMDk3NDQ4NjQxfQ.YBUAoDFLYLU5VKQwGpj34ZHk--9TBkTcIpDYombMfZQ"

def post(path, rows):
    data = json.dumps(rows).encode("utf-8")
    req = urllib.request.Request(
        f"{BASE}/{path}",
        data=data,
        method="POST",
        headers={
            "apikey": SVC,
            "Authorization": f"Bearer {SVC}",
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
    )
    with urllib.request.urlopen(req) as r:
        return r.status

bancos = [
    {"id": "galicia", "nombre": "Banco Galicia", "color": "#ff7a00"},
    {"id": "nacion", "nombre": "Banco Nación", "color": "#1b4a9c"},
    {"id": "provincia", "nombre": "Banco Provincia", "color": "#00a04a"},
    {"id": "bbva", "nombre": "BBVA", "color": "#1464a5"},
    {"id": "santander", "nombre": "Santander", "color": "#ec0000"},
    {"id": "macro", "nombre": "Banco Macro", "color": "#0072ce"},
]

V = "2026-06-19"
def d(banco, titulo, rubro, dias, pct, tope, medio, cond, url, conf):
    return {"banco_id": banco, "titulo": titulo, "rubro": rubro, "dias": dias,
            "porcentaje": pct, "tope": tope, "medio_pago": medio, "condiciones": cond,
            "url_fuente": url, "confianza": conf, "verificado_at": V, "activo": True}

descuentos = [
    d("galicia","15% en combustible","Combustible",["lunes"],15,"$15.000/mes Eminent, $10.000/mes general","Mastercard Galicia vía MODO","15% Eminent / 10% general. Estaciones adheridas, un pago.","https://www.galicia.ar/personas/promociones/promocion-combustible","media"),
    d("galicia","25% en farmacia (FarmaPlus)","Farmacia",["jueves"],25,"Compras > $40.000","Visa/Mastercard Galicia","Vigencia 21/05 al 31/08/2026. 25% reintegro.","https://www.galicia.ar/personas/promociones","media"),
    d("galicia","Hasta 30% en super (Coto Digital)","Supermercados",["jueves"],30,"$20.000/mes Eminent, $15.000/mes general","American Express Galicia","30% Eminent / 25% general. Requiere caja de ahorro. Solo Coto Digital.","https://descuentazo.com.ar/bancos/galicia-2","media"),
    d("galicia","Hasta 25% en cervecerías","Gastronomía",["jueves"],25,"$25.000/mes Eminent, $20.000/mes general","Visa Galicia vía MODO","25% Eminent / 20% general. Cervecería Patagonia.","https://descuentazo.com.ar/bancos/galicia-2","media"),
    d("galicia","Hasta 25% en Uber","Transporte",["miercoles","jueves"],25,"$4.000/mes","Visa/Mastercard/Amex Galicia y débito","25% Eminent / 20% general.","https://descuentazo.com.ar/bancos/galicia-2","media"),

    d("nacion","30% en supermercados y mayoristas","Supermercados",["miercoles"],30,"$12.000 por semana","MODO BNA+ con Visa/Mastercard crédito","Escaneo QR en comercios adheridos. Verificar prórroga de vigencia.","https://www.bna.com.ar/Personas/DescuentosYPromociones","media"),
    d("nacion","20% en ChangoMás","Supermercados",["lunes"],20,"$25.000 reintegro, mínimo $75.000","MODO BNA+","Solo ChangoMás.","https://www.bna.com.ar/Personas/DescuentosYPromociones","media"),
    d("nacion","20% en mayorista Nini","Supermercados",["jueves"],20,"$20.000 reintegro","MODO BNA+","Solo Mayorista Nini, sin mínimo.","https://www.bna.com.ar/Personas/DescuentosYPromociones","media"),
    d("nacion","20% en combustible","Combustible",["viernes"],20,"$10.000/mes (+5% Shell)","MODO BNA+ con Visa/Mastercard","YPF, Axion, Shell, Dapsa, Gulf. Pago QR.","https://www.bna.com.ar/Personas/DescuentosYPromociones","media"),
    d("nacion","25% en super El Nene","Supermercados",["lunes","jueves"],25,"$12.000 por mes","Tarjetas BNA","Solo Supermercado El Nene.","https://www.bna.com.ar/Personas/DescuentosYPromociones","media"),

    d("provincia","20% en comercios de cercanía","Supermercados",["lunes","martes","miercoles","jueves","viernes"],20,"$6.000 por semana","Cuenta DNI (QR/Clave DNI)","Carnicerías, verdulerías, pescaderías adheridas (PBA), lun a vie.","https://cuentadni.gba.gob.ar","media"),
    d("provincia","25% en gastronomía","Gastronomía",["sabado","domingo"],25,"$8.000 por semana","Cuenta DNI (QR/Clave DNI)","Locales gastronómicos adheridos, fin de semana.","https://cuentadni.gba.gob.ar","media"),
    d("provincia","20% en ChangoMás","Supermercados",["jueves"],20,None,"Cuenta DNI (QR/Clave DNI)","Cadena ChangoMás, los jueves.","https://cuentadni.gba.gob.ar","media"),
    d("provincia","30% en COTO","Supermercados",["jueves"],30,None,"Cuenta DNI (pago NFC)","COTO los jueves pagando con NFC desde la app.","https://cuentadni.gba.gob.ar","media"),
    d("provincia","15% en mayorista Nini","Supermercados",["martes"],15,None,"Cuenta DNI (QR/Clave DNI)","Nini Mayorista, los martes.","https://cuentadni.gba.gob.ar","media"),
    d("provincia","25% en combustible YPF Full","Combustible",["sabado","domingo"],25,"$8.000 por semana","Cuenta DNI (QR/Clave DNI)","Estaciones YPF Full adheridas, fin de semana.","https://cuentadni.gba.gob.ar","media"),

    d("bbva","30% en gastronomía y heladerías","Gastronomía",["martes","viernes"],30,"$12.000 por mes","Crédito BBVA vía MODO/QR Openpay","Restaurantes y heladerías adheridos. Vigencia hasta 30/06/2026.","https://www.bbva.com.ar/beneficios","media"),
    d("bbva","20% en combustible Axion","Combustible",["sabado"],20,"$6.000 por mes","Crédito BBVA (QR MODO)","Requiere cuenta sueldo BBVA y registro en ON Axion.","https://www.bbva.com.ar/beneficios","media"),
    d("bbva","30% cuenta sueldo (super/combustible)","Supermercados",["sabado","domingo"],30,"$10.000 por semana","Crédito BBVA","Solo cuenta sueldo BBVA. Verificar días por rubro en el portal.","https://www.bbva.com.ar/beneficios","baja"),

    d("santander","25% en DIA","Supermercados",["miercoles"],25,"$20.000 por mes","MODO App Santander / Visa","Sucursales DIA adheridas.","https://www.santander.com.ar/banco/online/personas/beneficios","media"),
    d("santander","25% en Carrefour","Supermercados",["viernes"],25,"$20.000 por mes","MODO App Santander / Visa","Carrefour adheridos.","https://www.santander.com.ar/banco/online/personas/beneficios","media"),
    d("santander","25% en ChangoMás","Supermercados",["jueves"],25,"$20.000 por mes","MODO App Santander / Visa","Solo suscriptores Santander Sorpresa.","https://www.santander.com.ar/banco/online/personas/beneficios","media"),
    d("santander","25% en Disco/Jumbo/Vea","Supermercados",["miercoles"],25,"$20.000 por mes","Visa débito o crédito","Clientes con acreditación de haberes.","https://www.santander.com.ar/banco/online/personas/beneficios","media"),

    d("macro","30% en YPF (Selecta)","Combustible",["martes"],30,"$25.000 por mes","MODO App Macro (tarjetas Selecta)","Solo clientes Macro Selecta. Pago presencial en YPF.","https://www.macro.com.ar/selecta","media"),
    d("macro","20% en YPF (Macro)","Combustible",["martes"],20,"$15.000 por mes","MODO App Macro / Visa Platinum","Clientes Macro registrados en MODO. YPF adheridas.","https://www.modo.com.ar/promos","media"),
    d("macro","30% Sábados Selecta (gastronomía)","Gastronomía",["sabado"],30,"$20.000 por mes por rubro","MODO App Macro (tarjetas Selecta)","Solo Macro Selecta. Desayunos/almuerzos 7-15hs, cines, peluquerías. Vigencia hasta 30/06/2026.","https://www.macro.com.ar/selecta/sabados","alta"),
    d("macro","25% en Hiper Libertad","Supermercados",["miercoles"],25,"$20.000","MODO App Macro","Compras online en Libertad. Verificar continuidad en junio.","https://www.macro.com.ar/selecta","baja"),
]

print("bancos:", post("bancos", bancos))
print("descuentos:", post("descuentos_bancarios", descuentos))
