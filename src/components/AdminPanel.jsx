import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { STATUS_LABELS, formatDate, formatTime, formatDuration, calcDuration } from '../lib/services'

const SERVICE_NAMES = {
  bp_machine: 'เครื่องวัดความดัน',
  oximeter: 'เครื่องวัดออกซิเจน',
  other: 'อุปกรณ์อื่น ๆ',
}

export default function AdminPanel({ onRefresh }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterDate, setFilterDate] = useState('')
  const [updating, setUpdating] = useState(null)
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [filterStatus, filterDate])

  async function fetchBookings() {
    setLoading(true)
    let q = supabase
      .from('bookings')
      .select('*')
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true })
    if (filterStatus !== 'all') q = q.eq('status', filterStatus)
    if (filterDate) q = q.eq('booking_date', filterDate)
    const { data } = await q
    setBookings(data || [])
    setLoading(false)
  }

  async function updateStatus(id, newStatus) {
    setUpdating(id)
    await supabase.from('bookings').update({ status: newStatus }).eq('id', id)
    setUpdating(null)
    fetchBookings()
    onRefresh()
  }

  function getServiceText(services) {
    if (!services || !Array.isArray(services)) return '-'
    return services.map(s => {
      const name = SERVICE_NAMES[s.id] || s.id
      return s.quantity > 1 ? `${name} ×${s.quantity}` : name
    }).join(', ')
  }

  const statusCounts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  }

  const nextStatusMap = {
    pending: [
      { status: 'confirmed', label: '✔ ยืนยันงาน', cls: 'btn-primary' },
      { status: 'cancelled', label: '✗ ยกเลิก', cls: 'btn-danger' },
    ],
    confirmed: [
      { status: 'completed', label: '🏁 เสร็จสิ้น', cls: 'btn-success' },
      { status: 'cancelled', label: '✗ ยกเลิก', cls: 'btn-danger' },
    ],
    completed: [],
    cancelled: [
      { status: 'pending', label: '↩ คืนสถานะ', cls: 'btn-secondary' },
    ],
  }

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: 10 }}>
          <h2 className="card-title" style={{ margin: 0 }}>🔧 จัดการนัดหมาย</h2>
          <button className="btn btn-secondary btn-sm" onClick={fetchBookings}>🔄 รีเฟรช</button>
        </div>

        {/* Summary counts */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '1rem' }}>
          {[
            { key: 'all', label: 'ทั้งหมด' },
            { key: 'pending', label: 'รอยืนยัน' },
            { key: 'confirmed', label: 'ยืนยันแล้ว' },
            { key: 'completed', label: 'เสร็จสิ้น' },
            { key: 'cancelled', label: 'ยกเลิก' },
          ].map(({ key, label }) => {
            const st = key !== 'all' ? STATUS_LABELS[key] : null
            return (
              <button
                key={key}
                onClick={() => setFilterStatus(key)}
                style={{
                  padding: '6px 14px', borderRadius: 20, border: '1.5px solid',
                  borderColor: filterStatus === key
                    ? (st?.color || '#1a1a2e')
                    : '#e8eaf0',
                  background: filterStatus === key
                    ? (st?.bg || '#1a1a2e')
                    : '#fff',
                  color: filterStatus === key
                    ? (st?.color || '#fff')
                    : '#6b7280',
                  fontSize: 13, cursor: 'pointer', transition: 'all 0.15s',
                  fontFamily: 'Sarabun, sans-serif',
                  fontWeight: filterStatus === key ? 600 : 400,
                }}
              >
                {label} ({statusCounts[key]})
              </button>
            )
          })}
        </div>

        {/* Date filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1rem' }}>
          <label style={{ margin: 0, fontSize: 13, whiteSpace: 'nowrap' }}>กรองวันที่:</label>
          <input
            type="date" value={filterDate}
            onChange={e => setFilterDate(e.target.value)}
            style={{ width: 'auto', flex: '0 0 auto' }}
          />
          {filterDate && (
            <button className="btn btn-secondary btn-sm" onClick={() => setFilterDate('')}>
              ล้าง
            </button>
          )}
        </div>

        {loading ? (
          <div className="loading">⏳ กำลังโหลด...</div>
        ) : bookings.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <p>ไม่พบรายการนัดหมาย</p>
          </div>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>วันที่</th>
                  <th>เวลา</th>
                  <th>ชื่อ</th>
                  <th>เบอร์</th>
                  <th>บริการ</th>
                  <th>สถานะ</th>
                  <th>ดำเนินการ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => {
                  const st = STATUS_LABELS[b.status] || STATUS_LABELS.pending
                  const actions = nextStatusMap[b.status] || []
                  const dur = calcDuration(b.services || [])
                  return (
                    <>
                      <tr key={b.id} style={{ cursor: 'pointer' }} onClick={() => setExpanded(expanded === b.id ? null : b.id)}>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{formatDate(b.booking_date)}</td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>
                          {formatTime(b.start_time)}–{formatTime(b.end_time)}
                          <div style={{ fontSize: 11, color: '#9ca3af' }}>{formatDuration(dur)}</div>
                        </td>
                        <td style={{ fontWeight: 500 }}>{b.customer_name}</td>
                        <td style={{ fontSize: 13 }}>{b.phone}</td>
                        <td style={{ fontSize: 13 }}>{getServiceText(b.services)}</td>
                        <td>
                          <span className="status-badge"
                            style={{ background: st.bg, color: st.color, borderColor: st.border }}>
                            {st.label}
                          </span>
                        </td>
                        <td>
                          {updating === b.id ? (
                            <span style={{ fontSize: 13, color: '#9ca3af' }}>⏳</span>
                          ) : (
                            <div className="action-btns" onClick={e => e.stopPropagation()}>
                              {actions.map(a => (
                                <button
                                  key={a.status}
                                  className={`btn btn-sm ${a.cls}`}
                                  onClick={() => updateStatus(b.id, a.status)}
                                >
                                  {a.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                      {expanded === b.id && (
                        <tr key={`${b.id}-detail`}>
                          <td colSpan={7} style={{ background: '#f9fafb', padding: '10px 16px' }}>
                            <div style={{ fontSize: 13, color: '#374151' }}>
                              {b.notes
                                ? <><strong>หมายเหตุ:</strong> {b.notes}</>
                                : <em style={{ color: '#9ca3af' }}>ไม่มีหมายเหตุ</em>
                              }
                              <div style={{ marginTop: 4, color: '#9ca3af', fontSize: 12 }}>
                                บันทึกเมื่อ: {new Date(b.created_at).toLocaleString('th-TH')}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
