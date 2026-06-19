import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import type { Promo } from '../types'

export default function PromoDetalle() {
  const { id } = useParams()
  const [promo, setPromo] = useState<Promo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    supabase
      .from('promos')
      .select('*, comercio:comercios(*)')
      .eq('id', id)
      .single()
      .then(({ data }) => {
        setPromo(data as Promo)
        setLoading(false)
      })
  }, [id])

  if (loading) return <p className="p-4 text-gray-500">Cargando…</p>
  if (!promo) return <p className="p-4 text-gray-500">Promo no encontrada.</p>

  const c = promo.comercio
  return (
    <div>
      {promo.foto_url && <img src={promo.foto_url} alt={promo.titulo} className="w-full h-48 object-cover" />}
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-xl font-bold">{promo.titulo}</h1>
          {promo.descuento && (
            <span className="bg-red-100 text-red-700 font-bold px-2 py-1 rounded">{promo.descuento}</span>
          )}
        </div>
        {promo.descripcion && <p className="text-gray-700">{promo.descripcion}</p>}

        {c && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <p className="font-semibold">{c.nombre}</p>
            <p className="text-sm text-gray-500">{c.rubro}</p>
            <p className="text-sm text-gray-600 mt-1">{c.direccion}</p>
            {c.telefono && <p className="text-sm text-gray-600">{c.telefono}</p>}
          </div>
        )}

        {promo.vigencia_hasta && (
          <p className="text-xs text-gray-400">Válido hasta {promo.vigencia_hasta}</p>
        )}

        <Link
          to="/escanear"
          className="block text-center bg-red-700 text-white font-semibold py-3 rounded-xl"
        >
          Canjear (escanear QR en el local)
        </Link>
      </div>
    </div>
  )
}
