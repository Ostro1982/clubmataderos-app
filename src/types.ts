export type Comercio = {
  id: string
  nombre: string
  rubro: string
  direccion: string
  lat: number | null
  lng: number | null
  logo_url: string | null
  telefono: string | null
  created_at: string
}

export type Promo = {
  id: string
  comercio_id: string
  titulo: string
  descripcion: string | null
  descuento: string | null
  foto_url: string | null
  vigencia_desde: string | null
  vigencia_hasta: string | null
  limite_canjes: number | null
  activa: boolean
  created_at: string
  comercio?: Comercio
}

export type Canje = {
  id: string
  user_id: string
  promo_id: string
  created_at: string
  promo?: Promo
}

export type Banco = {
  id: string
  nombre: string
  color: string
}

export type DescuentoBancario = {
  id: string
  banco_id: string
  titulo: string
  rubro: string
  dias: string[]
  porcentaje: number | null
  tope: string | null
  medio_pago: string | null
  condiciones: string | null
  url_fuente: string | null
  confianza: 'alta' | 'media' | 'baja'
  verificado_at: string | null
  activo: boolean
  banco?: Banco
}
