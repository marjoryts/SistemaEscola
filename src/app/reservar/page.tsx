'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AuthGuard } from '@/components/AuthGuard'

export default function ReservarPage() {
  return (
    <AuthGuard>
      <ReservarForm />
    </AuthGuard>
  )
}

function ReservarForm() {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    teacher_name: '',
    reservation_date: '',
    start_time: '',
    end_time: '',
    computers_available: 0,
    computers_unavailable: 0,
    tablets_available: 0,
    tablets_unavailable: 0,
    observations: '',
    returned_to: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setError('Usuário não autenticado')
      setLoading(false)
      return
    }

    const { error } = await supabase.from('reservations').insert({
      ...form,
      user_id: user.id,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/reservas')
    router.refresh()
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Nova Reserva</h1>

      <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Nome do Professor
            </label>
            <input
              type="text"
              name="teacher_name"
              required
              value={form.teacher_name}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="Seu nome"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Data
            </label>
            <input
              type="date"
              name="reservation_date"
              required
              value={form.reservation_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Hora Início
            </label>
            <input
              type="time"
              name="start_time"
              required
              value={form.start_time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">
              Hora Fim
            </label>
            <input
              type="time"
              name="end_time"
              required
              value={form.end_time}
              onChange={handleChange}
              className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <fieldset className="rounded-lg border border-zinc-200 p-4">
          <legend className="text-sm font-medium text-zinc-700">Computadores</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-zinc-500">Disponíveis</label>
              <input
                type="number"
                name="computers_available"
                min={0}
                value={form.computers_available}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500">Indisponíveis</label>
              <input
                type="number"
                name="computers_unavailable"
                min={0}
                value={form.computers_unavailable}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="rounded-lg border border-zinc-200 p-4">
          <legend className="text-sm font-medium text-zinc-700">Tablets</legend>
          <div className="mt-2 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs text-zinc-500">Disponíveis</label>
              <input
                type="number"
                name="tablets_available"
                min={0}
                value={form.tablets_available}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs text-zinc-500">Indisponíveis</label>
              <input
                type="number"
                name="tablets_unavailable"
                min={0}
                value={form.tablets_unavailable}
                onChange={handleChange}
                className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </fieldset>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Observações
          </label>
          <textarea
            name="observations"
            rows={3}
            value={form.observations}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Problemas com internet, apps faltando, dispositivos quebrados, etc."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Devolvido para
          </label>
          <input
            type="text"
            name="returned_to"
            value={form.returned_to}
            onChange={handleChange}
            className="mt-1 block w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Nome de quem recebeu os aparelhos"
          />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Salvando...' : 'Criar Reserva'}
        </button>
      </form>
    </div>
  )
}
