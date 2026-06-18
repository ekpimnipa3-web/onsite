import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { SERVICES, calcDuration, formatDuration, WORK_HOURS } from '../lib/services'

export default function BookingForm({ preSelectedDate, onComplete, onCancel }) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [date, setDate] = useState(preSelectedDate || '')
  const [startTime, setStartTime] = useState('')
  const [selectedServices, setSelectedServices] = useState([])
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [takenSlots, setTakenSlots] = useState([])

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    if (preSelectedDate) setDate(preSelectedDate)
  }, [preSelectedDate])

  useEffect(() => {
    if (date) fetchTakenSlots(date)
  }, [date])

  async function fetchTakenSlots(d) {
    const { data } = await supabase
      .from('bookings')
      .select('start_time, end_time, status')
      .eq('booking_date', d)
      .neq('status', 'cancelled')
    setTakenSlots(data || [])
  }

  function toggleService(svcId) {
    setSelectedServices(prev => {
      const exists = prev.find(s => s.id === svcId)
      if (exists) return prev.filter(s => s.id !== svcId)
      return [...prev, { id: svcId, quantity: 1 }]
    })
  }

  function changeQty(svcId, delta) {
    setSelectedServices(prev => prev.map(s =>
      s.id === svcId
        ? { ...s, quantity: Math.max(1, (s.quantity || 1) + delta) }
        : s
    ))
  }

  const totalMinutes = calcDuration(selectedServices)

  function timeToMinutes(t) {
    const [h, m] = t.split(':').map(Number)
    return h * 60 + m
  }

  function minutesToTime(m) {
    const h = Math.floor(m / 60).toString().padStart(2, '0')
    const min = (m % 60).toString().padStart(2, '0')
    return `${h}:${min}`
  }

  function isOverlapping(newStart, newEnd) {
    const ns = timeToMinutes(newStart)
    const ne = timeToMinutes(newEnd)
    return takenSlots.some(slot => {
      const ss = timeToMinutes(slot.start_time)
      const se = timeToMinutes(slot.end_time)
      return ns < se && ne > ss
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (!name.trim()) return setError('กรุณากรอกชื่อ-นามสกุล')
    if (!phone.trim()) return setError('กรุณากรอกเบอร์ติดต่อ')
    if (!date) return setError('กรุณาเลือกวันที่')
    if (!startTime) return setError('กรุณาเลือกเวลาเริ่ม')
    if (selectedServices.length === 0) return setError('กรุณาเลือกบริการอย่างน้อย 1 รายการ')

    const startMin = timeToMinutes(startTime)
    const endMin = startMin + totalMinutes
    const endTime = minutesToTime(endMin)

    if (startMin < WORK_HOURS.start * 60) return setError(`เวลาเริ่มต้นต้องไม่ก่อน ${WORK_HOURS.start}:00 น.`)
    if (endMin > WORK_HOURS.end * 60) return setError(`เวลาสิ้นสุด ${endTime} น. เกินเวลาทำการ (${WORK_HOURS.end}:00 น.)`)
    if (isOverlapping(startTime, endTime)) return setError('ช่วงเวลานี้มีการจองแล้ว กรุณาเลือกเวลาอื่น')

    setLoading(true)
    const { data, error: dbErr } = await supabase
      .from('bookings')
      .insert([{
        customer_name: name.trim(),
        phone: phone.trim(),
        booking_date: date,
        start_time: startTime,
        end_time: endTime,
        services: selectedServices,
        notes: notes.trim(),
        status: 'pending',
      }])
      .select()
      .single()

    setLoading(false)
    if (dbErr) return setError('เกิดข้อผิดพลาด: ' + dbErr.message)
    onComplete(data)
  }

  // Generate available time options
  function getTimeOptions() {
    const options = []
    for (let m = WORK_HOURS.start * 60; m <= WORK_HOURS.end * 60 - 30; m += 30) {
      options.push(minutesToTime(m))
    }
    return options
  }

  const timeOptions = getTimeOptions()

  return (
    <div style={{ maxWidth: 640, margin: '0 auto' }}>
      <div className="card">
        <h2 className="card-title">📝 จองนัดหมายเจ้าหน้าที่</h2>

        {error && <div className="error-box">⚠️ {error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-row">
              <label>ชื่อ-นามสกุล *</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="กรอกชื่อ-นามสกุล" required
              />
            </div>
            <div className="form-row">
              <label>เบอร์ติดต่อ *</label>
              <input
                type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                placeholder="0xx-xxx-xxxx" required
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="form-row">
              <label>วันที่ *</label>
              <input
                type="date" value={date} min={today}
                onChange={e => setDate(e.target.value)} required
              />
            </div>
            <div className="form-row">
              <label>เวลาเริ่ม *</label>
              <select value={startTime} onChange={e => setStartTime(e.target.value)} required>
                <option value="">เลือกเวลา</option>
                {timeOptions.map(t => (
                  <option key={t} value={t}>{t} น.</option>
                ))}
              </select>
            </div>
          </div>

          {date && takenSlots.length > 0 && (
            <div style={{ marginBottom: '1rem', padding: '10px 14px', background: '#fff7ed', borderRadius: 8, border: '1px solid #fdba74', fontSize: 13 }}>
              ⚠️ วันที่เลือกมีการจองอยู่แล้ว {takenSlots.length} รายการ — กรุณาตรวจสอบเวลาก่อนจอง
            </div>
          )}

          <div className="form-row">
            <label>บริการที่ต้องการ *</label>
            <div className="service-grid" style={{ marginTop: 8 }}>
              {SERVICES.map(svc => {
                const sel = selectedServices.find(s => s.id === svc.id)
                return (
                  <div
                    key={svc.id}
                    className={`service-card ${sel ? 'selected' : ''}`}
                    onClick={() => toggleService(svc.id)}
                  >
                    <div className="service-card-top">
                      <span style={{ fontSize: 20 }}>{svc.icon}</span>
                      <span className="service-name">{svc.name}</span>
                    </div>
                    <div className="service-duration">{svc.durationMinutes} นาที / ชิ้น</div>
                    {sel && (
                      <div className="service-qty" onClick={e => e.stopPropagation()}>
                        <button
                          type="button" className="qty-btn"
                          onClick={() => changeQty(svc.id, -1)}
                        >−</button>
                        <span className="qty-num">{sel.quantity}</span>
                        <button
                          type="button" className="qty-btn"
                          onClick={() => changeQty(svc.id, 1)}
                        >+</button>
                        <span style={{ fontSize: 12, color: '#6b7280' }}>ชิ้น</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {totalMinutes > 0 && startTime && (
            <div className="summary-bar">
              ⏱️ รวมระยะเวลา: <strong>{formatDuration(totalMinutes)}</strong>
              &nbsp;({startTime} – {(() => {
                const [h, m] = startTime.split(':').map(Number)
                const end = h * 60 + m + totalMinutes
                return `${Math.floor(end / 60).toString().padStart(2, '0')}:${(end % 60).toString().padStart(2, '0')}`
              })()} น.)
            </div>
          )}

          <div className="form-row" style={{ marginTop: '1rem' }}>
            <label>หมายเหตุ / ข้อมูลเพิ่มเติม</label>
            <textarea
              value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="ข้อมูลเพิ่มเติม เช่น สถานที่ หรือรายละเอียดอื่น ๆ"
            />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={onCancel}>
              ยกเลิก
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? '⏳ กำลังจอง...' : '✅ ยืนยันการจอง'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
