import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { supabase } from '../lib/supabase'
import { BARRIO_ID, BARRIO_CENTER, BARRIO_NOMBRE } from '../config'
import type { Promo } from '../types'

const promoIcon = L.divIcon({
  className: '',
  html: `<div style="width:26px;height:26px;border-radius:50% 50% 50% 0;background:#c5462f;border:3px solid #fff;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 26],
})
const meIcon = L.divIcon({
  className: '',
  html: `<div style="width:18px;height:18px;border-radius:50%;background:#2563eb;border:3px solid #fff;box-shadow:0 0 0 6px rgba(37,99,235,.25)"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

function distanciaM(a: [number, number], b: [number, number]) {
  const R = 6371000
  const dLat = ((b[0] - a[0]) * Math.PI) / 180
  const dLng = ((b[1] - a[1]) * Math.PI) / 180
  const lat1 = (a[0] * Math.PI) / 180
  const lat2 = (b[0] * Math.PI) / 180
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

function fmtDist(m: number | null) {
  if (m == null) return ''
  if (m < 1000) return `${Math.round(m / 10) * 10}m`
  return `${(m / 1000).toFixed(1)}km`
}

function Recenter({ pos }: { pos: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (pos) map.setView(pos, 15)
  }, [pos, map])
  return null
}

export default function MapaVivo() {
  const nav = useNavigate()
  const [promos, setPromos] = useState<Promo[]>([])
  const [me, setMe] = useState<[number, number] | null>(null)

  useEffect(() => {
    supabase
      .from('promos')
      .select('*, comercio:comercios(*)')
      .eq('activa', true)
      .eq('barrio_id', BARRIO_ID)
      .then(({ data }) => setPromos((data as Promo[]) ?? []))

    navigator.geolocation?.getCurrentPosition(
      (p) => setMe([p.coords.latitude, p.coords.longitude]),
      () => setMe(null),
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }, [])

  const conCoord = promos.filter((p) => p.comercio?.lat != null && p.comercio?.lng != null)

  const ordenadas = useMemo(() => {
    const ref = me ?? BARRIO_CENTER
    return [...conCoord]
      .map((p) => ({
        promo: p,
        dist: distanciaM(ref, [p.comercio!.lat as number, p.comercio!.lng as number]),
      }))
      .sort((a, b) => a.dist - b.dist)
  }, [conCoord, me])

  return (
    <div className="relative" style={{ height: 'calc(100vh - 58px - 62px)' }}>
      <MapContainer
        center={me ?? BARRIO_CENTER}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution="&copy; OpenStreetMap"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Recenter pos={me} />
        {me && <Marker position={me} icon={meIcon} />}
        {conCoord.map((p) => (
          <Marker
            key={p.id}
            position={[p.comercio!.lat as number, p.comercio!.lng as number]}
            icon={promoIcon}
            eventHandlers={{ click: () => nav(`/promo/${p.id}`) }}
          />
        ))}
      </MapContainer>

      {/* overlay barrio */}
      <div className="absolute top-0 left-0 right-0 z-[500] pointer-events-none p-3 bg-gradient-to-b from-black/35 to-transparent">
        <p className="text-white text-sm font-medium drop-shadow">
          📍 {BARRIO_NOMBRE} · {promos.length} promos cerca
        </p>
      </div>

      {/* bottom sheet glass */}
      <div className="absolute left-0 right-0 bottom-0 z-[500] rounded-t-3xl px-4 pt-2 pb-4 max-h-[46%] overflow-y-auto bg-white/80 backdrop-blur-md shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-10 h-1 rounded bg-gray-300 mx-auto mb-3" />
        <h4 className="text-xs uppercase tracking-wide text-gray-500 mb-2">A la vuelta tuyo</h4>
        {ordenadas.length === 0 && <p className="text-gray-500 text-sm py-3">No hay promos cerca.</p>}
        <div className="space-y-2">
          {ordenadas.map(({ promo: p, dist }) => (
            <button
              key={p.id}
              onClick={() => nav(`/promo/${p.id}`)}
              className="w-full flex gap-3 items-center p-2 rounded-2xl bg-white shadow-sm text-left"
            >
              {p.foto_url ? (
                <img src={p.foto_url} alt="" className="w-12 h-12 rounded-xl object-cover flex-none" />
              ) : (
                <div className="w-12 h-12 rounded-xl bg-gray-100 flex-none" />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{p.titulo}</p>
                <p className="text-xs text-gray-500 truncate">
                  {p.comercio?.nombre}
                  {me && <> · {fmtDist(dist)}</>}
                </p>
              </div>
              {p.descuento && <span className="font-extrabold text-red-700">{p.descuento}</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
