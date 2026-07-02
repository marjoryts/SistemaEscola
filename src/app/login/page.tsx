'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const router = useRouter()
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const action = mode === 'login'
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password, options: { data: { name: email.split('@')[0] } } })

    const { error } = await action

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    if (mode === 'login') {
      router.push('/reservar')
      router.refresh()
    } else {
      setMode('login')
      setError('Conta criada! Faça login.')
    }

    setLoading(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">
          {mode === 'login' ? 'Entrar' : 'Criar Conta'}
        </h1>
        <p className="mb-6 text-sm text-zinc-500">
          {mode === 'login'
            ? 'Faça login para acessar o sistema'
            : 'Crie sua conta para começar'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-zinc-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="professor@escola.edu"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-zinc-700">
              Senha
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className={`text-sm ${error.includes('criada') ? 'text-green-600' : 'text-red-500'}`}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar Conta'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-zinc-500">
          {mode === 'login' ? (
            <>
              Não tem conta?{' '}
              <button onClick={() => { setMode('signup'); setError('') }} className="text-blue-600 hover:underline">
                Cadastre-se
              </button>
            </>
          ) : (
            <>
              Já tem conta?{' '}
              <button onClick={() => { setMode('login'); setError('') }} className="text-blue-600 hover:underline">
                Faça login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}
