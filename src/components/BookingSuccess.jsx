import { formatDate, formatTime, formatDuration, calcDuration } from '../lib/services'

const SERVICE_NAMES = {
  bp_machine: 'เครื่องวัดความดัน',
  oximeter: 'เครื่องวัดออกซิเจน',
  other: 'อุปกรณ์อื่น ๆ',
}

export default function BookingSuccess({ booking, onBackToCalendar, onNewBooking }) {
  if (!booking) return null

  const dur = calcDuration(booking.services || [])
  const serviceText = (booking.services || []).map(s => {
    const name = SERVICE_NAMES[s.id] || s.id
    return s.quantity > 1 ? `${name} ×${s.quantity}` : name
  }).join(', ')

  return (
    <div className="success-wrap">
      <div className="card">
        <div style={{ textAlign: 'center' }}>
          <div className="success-icon">✅</div>
          <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 8 }}>จองนัดหมายสำเร็จ!</h2>
          <p style={{ color: '#6b7280', fontSize: 14 }}>
            เราได้รับการจองของคุณแล้ว เจ้าหน้าที่จะติดต่อกลับเพื่อยืนยัน
          </p>
        </div>

        <div className="success-detail">
          <div className="detail-row">
            <span className="detail-label">👤 ชื่อ</span>
            <span className="detail-value">{booking.customer_name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📱 เบอร์ติดต่อ</span>
            <span className="detail-value">{booking.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">📅 วันที่</span>
            <span className="detail-value">{formatDate(booking.booking_date)}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🕐 เวลา</span>
            <span className="detail-value">
              {formatTime(booking.start_time)} – {formatTime(booking.end_time)} น.
              <span style={{ fontSize: 12, color: '#6b7280', marginLeft: 8 }}>({formatDuration(dur)})</span>
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">🔧 บริการ</span>
            <span className="detail-value">{serviceText}</span>
          </div>
          {booking.notes && (
            <div className="detail-row">
              <span className="detail-label">📝 หมายเหตุ</span>
              <span className="detail-value">{booking.notes}</span>
            </div>
          )}
          <div className="detail-row" style={{ border: 'none' }}>
            <span className="detail-label">🔖 สถานะ</span>
            <span className="status-badge" style={{ background: '#fffbeb', color: '#f59e0b', borderColor: '#fcd34d' }}>
              รอยืนยัน
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={onBackToCalendar}>
            📅 ดูปฏิทิน
          </button>
          <button className="btn btn-primary" onClick={onNewBooking}>
            ✏️ จองเพิ่มเติม
          </button>
        </div>
      </div>
    </div>
  )
}
