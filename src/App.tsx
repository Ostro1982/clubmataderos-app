import { HashRouter, Routes, Route, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './lib/auth'
import Layout from './components/Layout'
import Home from './pages/Home'
import PromoDetalle from './pages/PromoDetalle'
import Mapa from './pages/Mapa'
import Escanear from './pages/Escanear'
import MisCanjes from './pages/MisCanjes'
import Login from './pages/Login'

function UserChip() {
  const { session } = useAuth()
  return (
    <Link
      to="/login"
      className="fixed top-2.5 right-3 z-20 text-white text-xs bg-red-800/70 px-2 py-1 rounded-full"
    >
      {session ? '👤 ' + (session.user.email?.split('@')[0] ?? '') : 'Ingresar'}
    </Link>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <UserChip />
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/promo/:id" element={<PromoDetalle />} />
            <Route path="/mapa" element={<Mapa />} />
            <Route path="/escanear" element={<Escanear />} />
            <Route path="/canjes" element={<MisCanjes />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Layout>
      </HashRouter>
    </AuthProvider>
  )
}
