'use client'

import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'

export function Navbar() {
  const [userEmail, setUserEmail] = useState('')
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserEmail(data.user.email ?? '')
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  if (pathname === '/login') return null

  return (
    <nav className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <a href="/" className="text-lg font-bold text-zinc-900">
            Reserva Escola
          </a>
          <div className="hidden gap-2 sm:flex">
            <a
              href="/reservar"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pathname === '/reservar'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Nova Reserva
            </a>
            <a
              href="/reservas"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pathname === '/reservas'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Minhas Reservas
            </a>
            <a
              href="/admin"
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                pathname === '/admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              Admin
            </a>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden text-sm text-zinc-500 sm:block">{userEmail}</span>
          <button
            onClick={handleLogout}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Sair
          </button>
        </div>
      </div>

      {/* Nav inferior mobile */}
      <div className="flex border-t border-zinc-200 sm:hidden">
        <a
          href="/reservar"
          className={`flex-1 py-2 text-center text-xs font-medium ${
            pathname === '/reservar' ? 'text-blue-600' : 'text-zinc-500'
          }`}
        >
          Nova Reserva
        </a>
        <a
          href="/reservas"
          className={`flex-1 py-2 text-center text-xs font-medium ${
            pathname === '/reservas' ? 'text-blue-600' : 'text-zinc-500'
          }`}
        >
          Minhas Reservas
        </a>
        <a
          href="/admin"
          className={`flex-1 py-2 text-center text-xs font-medium ${
            pathname === '/admin' ? 'text-blue-600' : 'text-zinc-500'
          }`}
        >
          Admin
        </a>
      </div>
    </nav>
  )
}
