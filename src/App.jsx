import { useState, useEffect } from 'react'
import BookingForm from './components/BookingForm'
import Calendar from './components/Calendar'
import AdminPanel from './components/AdminPanel'
import BookingSuccess from './components/BookingSuccess'
import './index.css'

export default function App() {
  const [view, setView] = useState('calendar') // calendar | book | admin | success
  const [successData, setSuccessData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const handleBookingComplete = (booking) => {
    setSuccessData(booking)
    setView('success')
    setRefreshKey(k => k + 1)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setView('book')
  }

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="header-brand">
            <span className="brand-icon">🏥</span>
            <div>
              <h1>ระบบจองนัดหมาย</h1>
              <p>เจ้าหน้าที่ลงพื้นที่หน้างาน</p>
            </div>
          </div>
          <nav className="header-nav">
            <button
              className={`nav-btn ${view === 'calendar' ? 'active' : ''}`}
              onClick={() => setView('calendar')}
            >
              📅 ปฏิทิน
            </button>
            <button
              className={`nav-btn ${view === 'book' ? 'active' : ''}`}
              onClick={() => { setSelectedDate(null); setView('book') }}
            >
              ✏️ จองนัด
            </button>
            <button
              className={`nav-btn ${view === 'admin' ? 'active' : ''}`}
              onClick={() => setView('admin')}
            >
              🔧 จัดการงาน
            </button>
          </nav>
        </div>
      </header>

      <main className="main">
        {view === 'calendar' && (
          <Calendar key={refreshKey} onDateSelect={handleDateSelect} />
        )}
        {view === 'book' && (
          <BookingForm
            preSelectedDate={selectedDate}
            onComplete={handleBookingComplete}
            onCancel={() => setView('calendar')}
          />
        )}
        {view === 'admin' && (
          <AdminPanel onRefresh={() => setRefreshKey(k => k + 1)} />
        )}
        {view === 'success' && (
          <BookingSuccess
            booking={successData}
            onBackToCalendar={() => setView('calendar')}
            onNewBooking={() => { setSuccessData(null); setView('book') }}
          />
        )}
      </main>
    </div>
  )
}
