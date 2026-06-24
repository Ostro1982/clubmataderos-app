import { Link, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BRAND, BARRIO_NOMBRE } from '../config'
import { IcCerca, IcPromos, IcEscanear, IcBancos, IcCanjes } from './Icons'

const tabs = [
  { to: '/', label: 'Cerca', Icon: IcCerca },
  { to: '/promos', label: 'Promos', Icon: IcPromos },
  { to: '/escanear', label: 'Escanear', Icon: IcEscanear },
  { to: '/bancos', label: 'Bancos', Icon: IcBancos },
  { to: '/canjes', label: 'Canjes', Icon: IcCanjes },
]

export default function Layout({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()
  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f7]">
      <header className="bg-red-700 text-white px-4 py-3 sticky top-0 z-10 shadow">
        <h1 className="font-bold text-lg tracking-tight leading-none">{BRAND}</h1>
        <p className="text-xs text-red-100 leading-none mt-0.5">{BARRIO_NOMBRE}</p>
      </header>

      <main className={`flex-1 ${pathname === '/' ? 'overflow-hidden' : 'pb-20'}`}>{children}</main>

      <nav className="fixed bottom-0 left-0 right-0 w-full bg-white border-t flex">
        {tabs.map((t) => {
          const active = pathname === t.to
          return (
            <Link
              key={t.to}
              to={t.to}
              className={`flex-1 py-2 flex flex-col items-center gap-0.5 text-center text-[11px] ${active ? 'text-red-700 font-semibold' : 'text-gray-400'}`}
            >
              <t.Icon className="w-6 h-6" />
              {t.label}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
