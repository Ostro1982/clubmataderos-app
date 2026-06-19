import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import type { Canje } from '../types'

export default function MisCanjes() {
  const { session } = useAuth()
  const [canjes, setCanjes] = useState<Canje[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!session) {
      setLoading(false)
      return
    }
    supabase
      .from('canjes')
      .select('*, promo:promos(*, comercio:comercios(*))')
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setCanjes((data as Canje[]) ?? [])
        setLoading(false)
      })
  }, [session])

  if (!session)
    return (
      <div className="p-6 text-center space-y-3">
        <p>Iniciá sesión para ver tus canjes.</p>
        <Link to="/login" className="inline-block bg-red-700 text-white px-4 py-2 rounded-xl">
          Iniciar sesión
        </Link>
      </div>
    )

  if (loading) return <p className="p-4 text-gray-500">Cargando…</p>
  if (!canjes.length) return <p className="p-4 text-gray-500">Todavía no canjeaste promos.</p>

  return (
    <div className="p-3 space-y-2">
      {canjes.map((c) => (
        <div key={c.id} className="bg-white rounded-xl p-3 shadow-sm">
          <div className="flex justify-between gap-2">
            <p className="font-semibold">{c.promo?.titulo}</p>
            {c.promo?.descuento && (
              <span className="text-red-700 font-bold text-sm">{c.promo.descuento}</span>
            )}
          </div>
          <p className="text-sm text-gray-500">{c.promo?.comercio?.nombre}</p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(c.created_at).toLocaleString('es-AR')}
          </p>
        </div>
      ))}
    </div>
  )
}
