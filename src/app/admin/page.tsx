'use client'

import { useEffect, useState } from 'react'
import { AuthGuard } from '@/components/AuthGuard'
import { createClient } from '@/lib/supabase/client'
import type { Reservation } from '@/types'

export default function AdminPage() {
  return (
    <AuthGuard>
      <AdminDashboard />
    </AuthGuard>
  )
}

function AdminDashboard() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<string>('')
  const supabase = createClient()

  async function loadReservations() {
    let query = supabase
      .from('reservations')
      .select('*')
      .order('reservation_date', { ascending: false })
      .order('start_time', { ascending: false })

    if (filterStatus) {
      query = query.eq('status', filterStatus)
    }

    const { data } = await query
    if (data) setReservations(data)
    setLoading(false)
  }

  useEffect(() => {
    loadReservations()
  }, [filterStatus])

  async function handleStatusUpdate(id: string, status: string) {
    await supabase.from('reservations').update({ status }).eq('id', id)
    loadReservations()
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return
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
      <h1 className="mb-6 text-2xl font-bold text-zinc-900">Dashboard Admin</h1>

      <div className="mb-4 flex gap-2">
        <button
          onClick={() => setFilterStatus('')}
          className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
            !filterStatus ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700'
          }`}
        >
          Todas
        </button>
        {['pending', 'confirmed', 'completed', 'cancelled'].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              filterStatus === s ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700'
            }`}
          >
            {statusLabel[s]}
          </button>
        ))}
      </div>

      {reservations.length === 0 ? (
        <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
          <p className="text-zinc-500">Nenhuma reserva encontrada.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50">
                <th className="px-4 py-3 font-medium text-zinc-600">Professor</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Data</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Horário</th>
                <th className="px-4 py-3 font-medium text-zinc-600">PCs</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Tablets</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Status</th>
                <th className="px-4 py-3 font-medium text-zinc-600">Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id} className="border-b border-zinc-100 hover:bg-zinc-50">
                  <td className="px-4 py-3 font-medium text-zinc-900">{res.teacher_name}</td>
                  <td className="px-4 py-3 text-zinc-600">
                    {new Date(res.reservation_date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 text-zinc-600">
                    {res.start_time} - {res.end_time}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-600">{res.computers_available}</span>
                    /
                    <span className="text-red-600">{res.computers_unavailable}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-green-600">{res.tablets_available}</span>
                    /
                    <span className="text-red-600">{res.tablets_unavailable}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusColor[res.status]}`}>
                      {statusLabel[res.status]}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      <select
                        value={res.status}
                        onChange={(e) => handleStatusUpdate(res.id, e.target.value)}
                        className="rounded border border-zinc-300 px-2 py-1 text-xs"
                      >
                        <option value="pending">Pendente</option>
                        <option value="confirmed">Confirmado</option>
                        <option value="completed">Concluído</option>
                        <option value="cancelled">Cancelado</option>
                      </select>
                      <button
                        onClick={() => handleDelete(res.id)}
                        className="rounded px-2 py-1 text-xs text-red-600 hover:bg-red-50"
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
