// Set de iconos propios para la nav (línea, 24x24, currentColor). Diseñados a medida, no genéricos.
type P = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

// Cerca: pin con casita adentro (lo local, a la vuelta)
export const IcCerca = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M12 21c3.8-4 6-7 6-10a6 6 0 1 0-12 0c0 3 2.2 6 6 10z" />
    <path d="M9.5 11.4 12 9.3l2.5 2.1" />
    <path d="M10 11.4v3.1h4v-3.1" />
  </svg>
)

// Promos: etiqueta de oferta con perno
export const IcPromos = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 13 11 6a1.8 1.8 0 0 1 1.3-.5l4.4.1a1.4 1.4 0 0 1 1.4 1.4l.1 4.4a1.8 1.8 0 0 1-.5 1.3l-7 7a1.5 1.5 0 0 1-2.1 0L4 15.1a1.5 1.5 0 0 1 0-2.1z" />
    <circle cx="14.6" cy="9.4" r="1.15" />
  </svg>
)

// Escanear: marco de escaneo con línea
export const IcEscanear = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8.5V7a3 3 0 0 1 3-3h1.5" />
    <path d="M15.5 4H17a3 3 0 0 1 3 3v1.5" />
    <path d="M20 15.5V17a3 3 0 0 1-3 3h-1.5" />
    <path d="M8.5 20H7a3 3 0 0 1-3-3v-1.5" />
    <path d="M7.5 12h9" />
  </svg>
)

// Bancos: tarjeta con banda y chip
export const IcBancos = ({ className }: P) => (
  <svg {...base} className={className}>
    <rect x="3" y="6" width="18" height="12" rx="2.5" />
    <path d="M3 9.5h18" />
    <rect x="6" y="12.4" width="4" height="2.6" rx="0.6" />
  </svg>
)

// Canjes: ticket con muescas, perforado y tilde
export const IcCanjes = ({ className }: P) => (
  <svg {...base} className={className}>
    <path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a1.6 1.6 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a1.6 1.6 0 0 0 0-4z" />
    <path d="M14.5 6.5v11" strokeDasharray="1.4 1.7" />
    <path d="M6.8 11.6 8.6 13.4 11.8 10" />
  </svg>
)
