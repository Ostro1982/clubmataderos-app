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
