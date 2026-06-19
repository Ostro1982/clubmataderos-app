import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'
import { Link } from 'react-router-dom'
import type { Promo } from '../types'

type Estado =
  | { tipo: 'scan' }
  | { tipo: 'procesando' }
  | { tipo: 'ok'; promo: Promo }
  | { tipo: 'repetido'; promo: Promo }
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
      setEstado({ tipo: 'error', msg: 'QR no válido para Club Mataderos.' })
      return
    }
    setEstado({ tipo: 'procesando' })

    const { data: promo, error: pe } = await supabase
      .from('promos')
      .select('*, comercio:comercios(*)')
      .eq('id', promoId)
      .eq('activa', true)
      .single()

    if (pe || !promo) {
      setEstado({ tipo: 'error', msg: 'Promo no encontrada o inactiva.' })
      return
    }

    const { error: ce } = await supabase
      .from('canjes')
      .insert({ promo_id: promoId, user_id: session!.user.id })

    if (ce) {
      if (ce.code === '23505') {
        setEstado({ tipo: 'repetido', promo: promo as Promo })
      } else {
        setEstado({ tipo: 'error', msg: 'Error al registrar canje: ' + ce.message })
      }
      return
    }
    setEstado({ tipo: 'ok', promo: promo as Promo })
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
        <Resultado emoji="✅" titulo="¡Canje exitoso!" promo={estado.promo} onReset={reset} />
      )}
      {estado.tipo === 'repetido' && (
        <Resultado emoji="⚠️" titulo="Ya canjeaste esta promo" promo={estado.promo} onReset={reset} />
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
}: {
  emoji: string
  titulo: string
  promo: Promo
  onReset: () => void
}) {
  return (
    <div className="text-center space-y-3 mt-6">
      <p className="text-5xl">{emoji}</p>
      <h2 className="text-xl font-bold">{titulo}</h2>
      <p className="font-semibold">{promo.titulo}</p>
      <p className="text-gray-500">{promo.comercio?.nombre}</p>
      {promo.descuento && (
        <p className="text-2xl font-bold text-red-700">{promo.descuento}</p>
      )}
      <p className="text-sm text-gray-500">Mostrale esta pantalla al comercio.</p>
      <button onClick={onReset} className="bg-gray-800 text-white px-4 py-2 rounded-xl mt-2">
        Escanear otro
      </button>
    </div>
  )
}
