import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import type { Promo } from '../types'

type Estado =
  | { tipo: 'scan' }
  | { tipo: 'procesando' }
  | { tipo: 'ok'; promo: Promo; codigo: string; fecha: string }
  | { tipo: 'repetido'; promo: Promo }
  | { tipo: 'agotada'; promo: Promo }
  | { tipo: 'error'; msg: string }

function parsePromoId(text: string): string | null {
  const t = text.trim()
  const url = t.match(/promo\/([0-9a-f-]{36})/i)
  if (url) return url[1]
  const pref = t.match(/^(?:CMP:|promo:)?([0-9a-f-]{36})$/i)
  if (pref) return pref[1]
  return null
}

export default function Escanear() {
  const { session } = useAuth()
  const [estado, setEstado] = useState<Estado>({ tipo: 'scan' })
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!session || estado.tipo !== 'scan' || startedRef.current) return
    startedRef.current = true
    const scanner = new Html5Qrcode('qr-reader')
    scannerRef.current = scanner

    scanner
      .start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (text) => {
          scanner.stop().catch(() => {})
          startedRef.current = false
          handle(text)
        },
        () => {}
      )
      .catch((e) => setEstado({ tipo: 'error', msg: 'No se pudo abrir la cámara: ' + e }))

    return () => {
      scanner.stop().catch(() => {})
      startedRef.current = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, estado.tipo])

  async function handle(text: string) {
    const promoId = parsePromoId(text)
    if (!promoId) {
      setEstado({ tipo: 'error', msg: 'QR no válido para Acá a la Vuelta.' })
      return
    }
    setEstado({ tipo: 'procesando' })

    const { data: promo } = await supabase
      .from('promos')
      .select('*, comercio:comercios(*)')
      .eq('id', promoId)
      .single()

    const { data, error } = await supabase.rpc('registrar_canje', { p_promo: promoId })
    if (error) {
      setEstado({ tipo: 'error', msg: 'Error al registrar: ' + error.message })
      return
    }
    const r = data as { status: string; codigo?: string; created_at?: string }

    if (r.status === 'ok' && promo) {
      setEstado({ tipo: 'ok', promo: promo as Promo, codigo: r.codigo!, fecha: r.created_at! })
    } else if (r.status === 'repetido' && promo) {
      setEstado({ tipo: 'repetido', promo: promo as Promo })
    } else if (r.status === 'agotada' && promo) {
      setEstado({ tipo: 'agotada', promo: promo as Promo })
    } else if (r.status === 'invalida') {
      setEstado({ tipo: 'error', msg: 'Promo no encontrada o inactiva.' })
    } else {
      setEstado({ tipo: 'error', msg: 'No se pudo registrar el canje.' })
    }
  }

  function reset() {
    setEstado({ tipo: 'scan' })
  }

  if (!session) {
    return (
      <div className="p-6 text-center space-y-3">
        <p>Tenés que iniciar sesión para canjear.</p>
        <Link to="/login" className="inline-block bg-red-700 text-white px-4 py-2 rounded-xl">
          Iniciar sesión
        </Link>
      </div>
    )
  }

  return (
    <div className="p-4">
      {estado.tipo === 'scan' && (
        <>
          <p className="text-center text-gray-600 mb-3">Escaneá el QR del comercio</p>
          <div id="qr-reader" className="rounded-xl overflow-hidden" />
        </>
      )}

      {estado.tipo === 'procesando' && <p className="text-center text-gray-500">Procesando…</p>}

      {estado.tipo === 'ok' && (
        <Resultado emoji="✅" titulo="¡Canje confirmado!" promo={estado.promo} onReset={reset}>
          <div className="bg-gray-900 text-white rounded-xl py-3 px-4 mt-2">
            <p className="text-xs text-gray-300">Código de canje</p>
            <p className="text-3xl font-mono font-bold tracking-widest">{estado.codigo}</p>
            <p className="text-xs text-gray-400 mt-1">{new Date(estado.fecha).toLocaleString('es-AR')}</p>
          </div>
          <p className="text-sm text-gray-500">Mostrale este código al comercio.</p>
        </Resultado>
      )}
      {estado.tipo === 'repetido' && (
        <Resultado emoji="⚠️" titulo="Ya canjeaste esta promo" promo={estado.promo} onReset={reset} />
      )}
      {estado.tipo === 'agotada' && (
        <Resultado emoji="🚫" titulo="Promo agotada" promo={estado.promo} onReset={reset}>
          <p className="text-sm text-gray-500">Se llegó al límite de canjes de esta promo.</p>
        </Resultado>
      )}
      {estado.tipo === 'error' && (
        <div className="text-center space-y-3 mt-6">
          <p className="text-4xl">❌</p>
          <p className="text-gray-700">{estado.msg}</p>
          <button onClick={reset} className="bg-red-700 text-white px-4 py-2 rounded-xl">
            Reintentar
          </button>
        </div>
      )}
    </div>
  )
}

function Resultado({
  emoji,
  titulo,
  promo,
  onReset,
  children,
}: {
  emoji: string
  titulo: string
  promo: Promo
  onReset: () => void
  children?: React.ReactNode
}) {
  return (
    <div className="text-center space-y-3 mt-6">
      <p className="text-5xl">{emoji}</p>
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p className="font-semibold">{promo.titulo}</p>
      <p className="text-gray-500">{promo.comercio?.nombre}</p>
      {promo.descuento && <p className="text-2xl font-bold text-red-700">{promo.descuento}</p>}
      {children}
      <button onClick={onReset} className="bg-gray-800 text-white px-4 py-2 rounded-xl mt-2">
        Escanear otro
      </button>
    </div>
  )
}
