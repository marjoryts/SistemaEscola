'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/AuthGuard'
import { createClient } from '@/lib/supabase/client'
import type { Reservation } from '@/types'

export default function ReservasPage() {
  return (
    <AuthGuard>
      <ReservasList />
    </AuthGuard>
  )
}

function ReservasList() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  async function loadReservations() {
    const { data } = await supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (data) setReservations(data)
    setLoading(false)
  }

  useEffect(() => {
    loadReservations()
  }, [])

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta reserva?')) return
    await supabase.from('reservations').delete().eq('id', id)
    loadReservations()
  }

  const statusColor: Record<string, string> = {
    pending: 'bg-yellow-100 text-yellow-800',
    confirmed: 'bg-blue-100 text-blue-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
  }

  const statusLabel: Record<string, string> = {
    pending: 'Pendente',
    confirmed: 'Confirmado',
    completed: 'Concluído',
    cancelled: 'Cancelado',
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Minhas Reservas</h1>

      {reservations.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-zinc-500">Nenhuma reserva encontrada.</p>
          <a
            href="/reservar"
            className="mt-4 inline-block rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Criar Primeira Reserva
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((res) => {
            const totalComputers = res.computers_available + res.computers_unavailable
            const totalTablets = res.tablets_available + res.tablets_unavailable

            return (
              <div key={res.id} className="rounded-2xl bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-zinc-900">{res.teacher_name}</h3>
                    <p className="mt-1 text-sm text-zinc-500">
                      {new Date(res.reservation_date).toLocaleDateString('pt-BR')} &middot;{' '}
                      {res.start_time} às {res.end_time}
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[res.status]}`}>
                    {statusLabel[res.status]}
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <p className="text-xs text-blue-600">PCs OK</p>
                    <p className="text-lg font-bold text-blue-700">{res.computers_available}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2 text-center">
                    <p className="text-xs text-red-600">PCs Ruins</p>
                    <p className="text-lg font-bold text-red-700">{res.computers_unavailable}</p>
                  </div>
                  <div className="rounded-lg bg-blue-50 p-2 text-center">
                    <p className="text-xs text-blue-600">Tablets OK</p>
                    <p className="text-lg font-bold text-blue-700">{res.tablets_available}</p>
                  </div>
                  <div className="rounded-lg bg-red-50 p-2 text-center">
                    <p className="text-xs text-red-600">Tablets Ruins</p>
                    <p className="text-lg font-bold text-red-700">{res.tablets_unavailable}</p>
                  </div>
                </div>

                {res.observations && (
                  <p className="mt-3 rounded-lg bg-zinc-50 p-3 text-sm text-zinc-600">
                    {res.observations}
                  </p>
                )}

                {res.returned_to && (
                  <p className="mt-2 text-sm text-zinc-500">
                    Devolvido para: <span className="font-medium text-zinc-700">{res.returned_to}</span>
                  </p>
                )}

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => handleDelete(res.id)}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
