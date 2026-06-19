import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Comercio } from '../types'

export default function Mapa() {
  const [comercios, setComercios] = useState<Comercio[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('comercios')
      .select('*')
      .order('nombre')
      .then(({ data }) => {
        setComercios((data as Comercio[]) ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4 text-gray-500">Cargando…</p>

  return (
    <div className="p-3 space-y-2">
      <p className="text-sm text-gray-500 px-1">Comercios adheridos</p>
      {comercios.map((c) => (
        <div key={c.id} className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex justify-between items-start gap-2">
            <div>
              <p className="font-semibold">{c.nombre}</p>
              <p className="text-sm text-gray-500">{c.rubro}</p>
              <p className="text-sm text-gray-600 mt-1">{c.direccion}</p>
            </div>
            {c.lat && c.lng && (
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${c.lat},${c.lng}`}
                target="_blank"
                rel="noreferrer"
                className="text-red-700 text-sm whitespace-nowrap"
              >
                Ver mapa →
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
