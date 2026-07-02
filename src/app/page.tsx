'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'
import { QRCodeSVG } from 'qrcode.react'

export default function Home() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setLoading(false)
    })
  }, [])

  const totalReservas = 0 // placeholder - será carregado do banco

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-zinc-900">Reserva Escola</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Sistema de reserva de computadores e tablets
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          </div>
        ) : user ? (
          <div className="space-y-3">
            <a
              href="/reservar"
              className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 p-4 text-white shadow-sm hover:bg-blue-700"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Reserva
            </a>
            <a
              href="/reservas"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              Minhas Reservas
            </a>
            <a
              href="/admin"
              className="flex items-center justify-center gap-2 rounded-2xl bg-white p-4 text-zinc-700 shadow-sm hover:bg-zinc-50"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Admin
            </a>
          </div>
        ) : (
          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-4 flex justify-center">
              <QRCodeSVG value={siteUrl} size={180} />
            </div>
            <p className="mb-4 text-sm text-zinc-500">
              Escaneie o QR code para acessar ou faça login
            </p>
            <a
              href="/login"
              className="block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Fazer Login
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
