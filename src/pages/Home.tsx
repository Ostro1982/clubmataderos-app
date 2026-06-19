import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Promo } from '../types'

export default function Home() {
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('promos')
      .select('*, comercio:comercios(*)')
      .eq('activa', true)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (error) console.error(error)
        setPromos((data as Promo[]) ?? [])
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="p-4 text-gray-500">Cargando promos…</p>
  if (!promos.length) return <p className="p-4 text-gray-500">No hay promos cargadas todavía.</p>

  return (
    <div className="p-3 space-y-3">
      {promos.map((p) => (
        <Link
          key={p.id}
          to={`/promo/${p.id}`}
          className="block bg-white rounded-xl shadow-sm overflow-hidden"
        >
          {p.foto_url && <img src={p.foto_url} alt={p.titulo} className="w-full h-36 object-cover" />}
          <div className="p-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-semibold">{p.titulo}</h2>
              {p.descuento && (
                <span className="bg-red-100 text-red-700 text-sm font-bold px-2 py-0.5 rounded">
                  {p.descuento}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">{p.comercio?.nombre}</p>
            {p.descripcion && <p className="text-sm text-gray-600 mt-1">{p.descripcion}</p>}
          </div>
        </Link>
      ))}
    </div>
  )
}
