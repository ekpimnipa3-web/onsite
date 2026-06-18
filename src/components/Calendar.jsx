import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, formatTime } from '../lib/services'

const WEEKDAYS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
const MONTHS_TH = ['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน',
  'กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม']

const STATUS_COLORS = {
  pending: '#f59e0b',
  confirmed: '#2563eb',
  completed: '#16a34a',
  cancelled: '#dc2626',
}

export default function Calendar({ onDateSelect }) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [bookings, setBookings] = useState([])
  const [selectedDay, setSelectedDay] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMonthBookings()
  }, [year, month])

  async function fetchMonthBookings() {
    setLoading(true)
    const from = `${year}-${String(month + 1).padStart(2, '0')}-01`
    const lastDay = new Date(year, month + 1, 0).getDate()
    const to = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
    const { data } = await supabase
      .from('bookings')
      .select('id, booking_date, start_time, end_time, customer_name, services, status')
      .gte('booking_date', from)
      .lte('booking_date', to)
      .neq('status', 'cancelled')
      .order('start_time')
    setBookings(data || [])
    setLoading(false)
  }

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
    setSelectedDay(null)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
    setSelectedDay(null)
  }

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.toISOString().split('T')[0]

  function getDateStr(day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
  }

  function getBookingsForDay(day) {
    return bookings.filter(b => b.booking_date === getDateStr(day))
  }

  const selectedDayBookings = selectedDay ? getBookingsForDay(selectedDay) : []

  function handleDayClick(day) {
    const ds = getDateStr(day)
    const isPast = ds < today
    if (isPast) return
    setSelectedDay(day === selectedDay ? null : day)
  }

  function getServiceNames(services) {
    if (!services || !Array.isArray(services)) return '-'
    const { SERVICES } = require('../lib/services') || {}
    return services.map(s => {
      const svcName = s.id === 'bp_machine' ? 'เครื่องวัดความดัน'
        : s.id === 'oximeter' ? 'เครื่องวัดออกซิเจน'
        : s.id === 'other' ? 'อุปกรณ์อื่น ๆ'
        : s.id
      return s.quantity > 1 ? `${svcName} (${s.quantity})` : svcName
    }).join(', ')
  }

  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <div className="card">
        <div className="cal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 className="card-title" style={{ margin: 0 }}>
              📅 {MONTHS_TH[month]} {year + 543}
            </h2>
            {loading && <span style={{ fontSize: 13, color: '#9ca3af' }}>กำลังโหลด...</span>}
          </div>
          <div className="cal-nav">
            <button className="btn btn-secondary btn-sm" onClick={prevMonth}>◀</button>
            <button className="btn btn-secondary btn-sm" onClick={() => { setYear(now.getFullYear()); setMonth(now.getMonth()); setSelectedDay(null) }}>วันนี้</button>
            <button className="btn btn-secondary btn-sm" onClick={nextMonth}>▶</button>
          </div>
        </div>

        <div className="legend" style={{ marginBottom: '1rem' }}>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#f59e0b' }}></span>รอยืนยัน</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#2563eb' }}></span>ยืนยันแล้ว</span>
          <span className="legend-item"><span className="legend-dot" style={{ background: '#16a34a' }}></span>เสร็จสิ้น</span>
        </div>

        <div className="cal-grid">
          {WEEKDAYS.map(w => (
            <div key={w} className="cal-weekday">{w}</div>
          ))}
          {cells.map((day, i) => {
            if (!day) return <div key={`e-${i}`} className="cal-day empty" />
            const ds = getDateStr(day)
            const dayBookings = getBookingsForDay(day)
            const isPast = ds < today
            const isToday = ds === today
            const isSelected = selectedDay === day
            return (
              <div
                key={day}
                className={[
                  'cal-day',
                  isPast ? 'past' : '',
                  isToday ? 'today' : '',
                  dayBookings.length > 0 ? 'has-bookings' : '',
                  isSelected ? 'today' : '',
                ].join(' ')}
                onClick={() => handleDayClick(day)}
                title={dayBookings.length > 0 ? `มีนัด ${dayBookings.length} รายการ` : ''}
              >
                <div className="cal-day-num">{day}</div>
                {dayBookings.length > 0 && (
                  <div className="cal-dots">
                    {dayBookings.slice(0, 4).map(b => (
                      <span key={b.id} className="cal-dot" style={{ background: STATUS_COLORS[b.status] || '#9ca3af' }} />
                    ))}
                    {dayBookings.length > 4 && <span style={{ fontSize: 10, color: '#6b7280' }}>+{dayBookings.length - 4}</span>}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={() => onDateSelect(null)}>
            ✏️ จองนัดหมาย
          </button>
        </div>
      </div>

      {selectedDay && (
        <div className="card" style={{ marginTop: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ fontWeight: 600 }}>
              รายการนัด — วันที่ {selectedDay} {MONTHS_TH[month]} {year + 543}
            </h3>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => onDateSelect(getDateStr(selectedDay))}
            >
              + จองวันนี้
            </button>
          </div>

          {selectedDayBookings.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📭</div>
              <p>ยังไม่มีการจองในวันนี้</p>
            </div>
          ) : (
            <div className="time-slots">
              {selectedDayBookings.map(b => {
                const st = STATUS_LABELS[b.status] || STATUS_LABELS.pending
                return (
                  <div key={b.id} className="time-slot">
                    <div className="time-slot-time">
                      🕐 {formatTime(b.start_time)} – {formatTime(b.end_time)}
                    </div>
                    <div className="time-slot-info">
                      <div className="time-slot-name">{b.customer_name}</div>
                      <div className="time-slot-services">{getServiceNames(b.services)}</div>
                    </div>
                    <span
                      className="status-badge"
                      style={{ background: st.bg, color: st.color, borderColor: st.border }}
                    >
                      {st.label}
                    </span>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
