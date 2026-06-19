import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import type { Banco, DescuentoBancario } from '../types'

const DIAS = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']
const DIAS_LABEL: Record<string, string> = {
  lunes: 'Lun', martes: 'Mar', miercoles: 'Mié', jueves: 'Jue', viernes: 'Vie', sabado: 'Sáb', domingo: 'Dom',
}
const HOY = DIAS[(new Date().getDay() + 6) % 7] // getDay: 0=Dom

const LS_KEY = 'cm_mis_bancos'

function loadMisBancos(): string[] {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]')
  } catch {
    return []
  }
}

export default function Descuentos() {
  const [bancos, setBancos] = useState<Banco[]>([])
  const [descuentos, setDescuentos] = useState<DescuentoBancario[]>([])
  const [loading, setLoading] = useState(true)
  const [misBancos, setMisBancos] = useState<string[]>(loadMisBancos)
  const [dia, setDia] = useState<string>(HOY)

  useEffect(() => {
    Promise.all([
      supabase.from('bancos').select('*').order('nombre'),
      supabase.from('descuentos_bancarios').select('*, banco:bancos(*)').eq('activo', true),
    ]).then(([b, d]) => {
      setBancos((b.data as Banco[]) ?? [])
      setDescuentos((d.data as DescuentoBancario[]) ?? [])
      setLoading(false)
    })
  }, [])

  function toggleBanco(id: string) {
    setMisBancos((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      localStorage.setItem(LS_KEY, JSON.stringify(next))
      return next
    })
  }

  const filtrados = useMemo(() => {
    return descuentos
      .filter((d) => (misBancos.length === 0 ? true : misBancos.includes(d.banco_id)))
      .filter((d) => (dia === 'todos' ? true : d.dias.includes(dia)))
      .sort((a, b) => (b.porcentaje ?? 0) - (a.porcentaje ?? 0))
  }, [descuentos, misBancos, dia])

  if (loading) return <p className="p-4 text-gray-500">Cargando descuentos…</p>

  return (
    <div className="p-3">
      <h2 className="font-bold text-lg px-1">Descuentos bancarios</h2>
      <p className="text-xs text-gray-500 px-1 mb-3">
        Elegí tus bancos para ver solo tus descuentos. Datos verificados al 19/06/2026 — confirmá vigencia en el banco.
      </p>

      {/* Mis bancos */}
      <p className="text-xs font-semibold text-gray-600 px-1 mb-1">Mis bancos</p>
      <div className="flex flex-wrap gap-2 mb-3">
        {bancos.map((b) => {
          const on = misBancos.includes(b.id)
          return (
            <button
              key={b.id}
              onClick={() => toggleBanco(b.id)}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border"
              style={
                on
                  ? { background: b.color, color: '#fff', borderColor: b.color }
                  : { background: '#fff', color: b.color, borderColor: b.color }
              }
            >
              {b.nombre}
            </button>
          )
        })}
      </div>

      {/* Filtro día */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        <DiaChip label="Todos" active={dia === 'todos'} onClick={() => setDia('todos')} />
        {DIAS.map((d) => (
          <DiaChip
            key={d}
            label={DIAS_LABEL[d] + (d === HOY ? ' (hoy)' : '')}
            active={dia === d}
            onClick={() => setDia(d)}
          />
        ))}
      </div>

      {filtrados.length === 0 ? (
        <p className="p-4 text-gray-500 text-sm">No hay descuentos para ese filtro.</p>
      ) : (
        <div className="space-y-2">
          {filtrados.map((d) => (
            <DescuentoCard key={d.id} d={d} />
          ))}
        </div>
      )}
    </div>
  )
}

function DiaChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-2.5 py-1 rounded-full border ${
        active ? 'bg-red-700 text-white border-red-700' : 'bg-white text-gray-600 border-gray-300'
      }`}
    >
      {label}
    </button>
  )
}

function DescuentoCard({ d }: { d: DescuentoBancario }) {
  const color = d.banco?.color ?? '#666'
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden flex">
      <div className="w-1.5" style={{ background: color }} />
      <div className="p-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
              style={{ background: color }}
            >
              {d.banco?.nombre}
            </span>
            <h3 className="font-semibold mt-1.5">{d.titulo}</h3>
          </div>
          {d.porcentaje != null && (
            <span className="text-2xl font-extrabold" style={{ color }}>
              {d.porcentaje}%
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-2">
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">{d.rubro}</span>
          {d.dias.map((dd) => (
            <span key={dd} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
              {DIAS_LABEL[dd] ?? dd}
            </span>
          ))}
        </div>

        {d.medio_pago && <p className="text-xs text-gray-500 mt-2">💳 {d.medio_pago}</p>}
        {d.tope && <p className="text-xs text-gray-500">Tope: {d.tope}</p>}
        {d.condiciones && <p className="text-xs text-gray-500 mt-1">{d.condiciones}</p>}

        <div className="flex items-center justify-between mt-2">
          {d.url_fuente && (
            <a
              href={d.url_fuente}
              target="_blank"
              rel="noreferrer"
              className="text-xs underline"
              style={{ color }}
            >
              Ver en el banco →
            </a>
          )}
          <span
            className={`text-[10px] px-1.5 py-0.5 rounded ${
              d.confianza === 'alta'
                ? 'bg-green-100 text-green-700'
                : d.confianza === 'media'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-200 text-gray-600'
            }`}
            title="Nivel de confianza del dato"
          >
            {d.confianza}
          </span>
        </div>
      </div>
    </div>
  )
}
