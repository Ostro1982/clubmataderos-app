import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../lib/supabase'
import { BARRIO_ID, BARRIO_CENTER } from '../config'
import type { Comercio } from '../types'

// Fix iconos default de leaflet con bundlers
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
})

export default function Mapa() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('comercios')
      .select('*')
      .eq('barrio_id', BARRIO_ID)
      .order('nombre')
      .then(({ data }) => {
        setComercios((data as Comercio[]) ?? [])
        setLoading(false)
      })
  }, [])

  const conCoord = comercios.filter((c) => c.lat != null && c.lng != null)

  return (
    <div>
      <div className="h-[60vh] w-full">
        <MapContainer center={BARRIO_CENTER} zoom={15} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {conCoord.map((c) => (
            <Marker key={c.id} position={[c.lat as number, c.lng as number]} icon={icon}>
              <Popup>
                <strong>{c.nombre}</strong>
                <br />
                <span className="text-gray-500">{c.rubro}</span>
                {c.direccion && (
                  <>
                    <br />
                    {c.direccion}
                  </>
                )}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      <div className="p-3">
        <p className="text-sm text-gray-500 mb-2">{comercios.length} comercios adheridos</p>
        {loading && <p className="text-gray-500">Cargando…</p>}
        <div className="space-y-2">
          {comercios.map((c) => (
            <div key={c.id} className="bg-white rounded-xl p-3 shadow-sm flex justify-between items-start gap-2">
              <div>
                <p className="font-semibold">{c.nombre}</p>
                <p className="text-sm text-gray-500">{c.rubro}</p>
                {c.direccion && <p className="text-sm text-gray-600">{c.direccion}</p>}
              </div>
              {c.lat && c.lng && (
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-red-700 text-sm whitespace-nowrap"
                >
                  Ir →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
