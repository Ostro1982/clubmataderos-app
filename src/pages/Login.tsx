import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { session, signOut } = useAuth()
  const nav = useNavigate()
  const [modo, setModo] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [msg, setMsg] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setMsg('')
    const fn =
      modo === 'login'
        ? supabase.auth.signInWithPassword({ email, password: pass })
        : supabase.auth.signUp({ email, password: pass })
    const { error } = await fn
    setBusy(false)
    if (error) {
      setMsg(error.message)
      return
    }
    if (modo === 'signup') {
      setMsg('Cuenta creada. Ya podés usar la app.')
    }
    nav('/')
  }

  if (session) {
    return (
      <div className="p-6 text-center space-y-3">
        <p>Sesión iniciada como</p>
        <p className="font-semibold">{session.user.email}</p>
        <button
          onClick={() => signOut()}
          className="bg-gray-800 text-white px-4 py-2 rounded-xl"
        >
          Cerrar sesión
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">
        {modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
      </h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 bg-white"
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Contraseña"
          value={pass}
          onChange={(e) => setPass(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 bg-white"
        />
        <button
          disabled={busy}
          className="w-full bg-red-700 text-white font-semibold py-3 rounded-xl disabled:opacity-50"
        >
          {busy ? '…' : modo === 'login' ? 'Entrar' : 'Crear cuenta'}
        </button>
      </form>
      {msg && <p className="text-sm text-gray-600 mt-3">{msg}</p>}
      <button
        onClick={() => setModo(modo === 'login' ? 'signup' : 'login')}
        className="text-red-700 text-sm mt-4 underline"
      >
        {modo === 'login' ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Iniciá sesión'}
      </button>
    </div>
  )
}
