export type UserRole = 'teacher' | 'admin'

export type ReservationStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Profile {
  id: string
  name: string
  role: UserRole
  created_at: string
}

export interface Reservation {
  id: string
  teacher_name: string
  reservation_date: string
  start_time: string
  end_time: string
  computers_available: number
  computers_unavailable: number
  tablets_available: number
  tablets_unavailable: number
  observations: string
  returned_to: string
  status: ReservationStatus
  user_id: string
  created_at: string
  updated_at: string
}

export type ReservationFormData = Omit<Reservation, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'status'>
