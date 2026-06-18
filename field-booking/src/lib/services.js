export const SERVICES = [
  { id: 'bp_machine', name: 'เครื่องวัดความดัน', durationMinutes: 30, icon: '🩺' },
  { id: 'oximeter', name: 'เครื่องวัดออกซิเจน', durationMinutes: 20, icon: '💉' },
  { id: 'other', name: 'อุปกรณ์อื่น ๆ', durationMinutes: 30, icon: '🔧' },
]

export const STATUS_LABELS = {
  pending: { label: 'รอยืนยัน', color: '#f59e0b', bg: '#fffbeb', border: '#fcd34d' },
  confirmed: { label: 'ยืนยันแล้ว', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd' },
  completed: { label: 'เสร็จสิ้น', color: '#16a34a', bg: '#f0fdf4', border: '#86efac' },
  cancelled: { label: 'ยกเลิก', color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
}

export const WORK_HOURS = { start: 8, end: 17 }

export function calcDuration(selectedServices) {
  return selectedServices.reduce((total, svc) => {
    const found = SERVICES.find(s => s.id === svc.id)
    if (!found) return total
    return total + found.durationMinutes * (svc.quantity || 1)
  }, 0)
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} นาที`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h} ชั่วโมง ${m} นาที` : `${h} ชั่วโมง`
}

export function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function formatTime(timeStr) {
  if (!timeStr) return ''
  return timeStr.slice(0, 5)
}
