import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'

const tabs = [
  { to: '/', label: 'Promos', icon: '🏷️' },
  { to: '/bancos', label: 'Bancos', icon: '🏦' },
  { to: '/escanear', label: 'Escanear', icon: '📷' },
  { to: '/mapa', label: 'Mapa', icon: '🗺️' },
  { to: '/canjes', label: 'Canjes', icon: '🎟️' },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto bg-[#f5f5f7]">
      <header className="bg-red-700 text-white px-4 py-3 sticky top-0 z-10 shadow">
        <h1 className="font-bold text-lg tracking-tight">Club Mataderos</h1>
      </header>

      <main className="flex-1 pb-20">{children}</main>

      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t flex">
        {tabs.map((t) => {
          const active = pathname === t.to
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex-1 py-2 text-center text-xs ${active ? 'text-red-700 font-semibold' : 'text-gray-500'}`}
            >
              <div className="text-xl leading-none">{t.icon}</div>
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
