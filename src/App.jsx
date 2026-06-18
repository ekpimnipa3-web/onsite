import { useState, useEffect } from 'react'
import BookingForm from './components/BookingForm'
import Calendar from './components/Calendar'
import AdminPanel from './components/AdminPanel'
import BookingSuccess from './components/BookingSuccess'

export default function App() {
  const [view, setView] = useState('calendar') // calendar | book | admin | success | login
  const [successData, setSuccessData] = useState(null)
  const [selectedDate, setSelectedDate] = useState(null)
  const [refreshKey, setRefreshKey] = useState(0)
  
  // 🔒 ระบบล็อกอินสำหรับเจ้าหน้าที่
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')

  // รหัสผ่านของพยาบาล/เจ้าหน้าที่ (เปลี่ยนได้ตามต้องการ)
  const ADMIN_PASSWORD = 'nurse1234'

  const handleBookingComplete = (booking) => {
    setSuccessData(booking)
    setView('success')
    setRefreshKey(k => k + 1)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setView('book') // เด้งไปหน้ากรอกข้อมูลตามเดิมเมื่อกดเลือกวันในปฏิทิน
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setView('admin') // รหัสถูก เข้าหน้าจัดการงานทันที
      setLoginError('')
      setPassword('')
    } else {
      setLoginError('❌ รหัสผ่านไม่ถูกต้อง สำหรับเจ้าหน้าที่พยาบาลเท่านั้น')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setView('calendar')
  }

  // ฟังก์ชันช่วยสลับหน้าเมื่อกดปุ่มจัดการงาน (ถ้าล็อกอินแล้วให้เข้าเลย ถ้ายังให้ไปหน้าล็อกอินก่อน)
  const handleAdminNavClick = () => {
    if (isAuthenticated) {
      setView('admin')
    } else {
      setView('login')
    }
  }

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: "'Sarabun', sans-serif" }}>
      
      {/* 🧭 Header & Nav ดีไซน์ใหม่ สวย คลีน สไตล์โมเดิร์น */}
      <header style={{ backgroundColor: '#ffffff', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)', position: 'sticky', top: 0, zIndex: 50 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px', height: '72px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* โลโก้และชื่อเว็บ */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => setView('calendar')}>
            <span style={{ fontSize: '28px', backgroundColor: '#eff6ff', padding: '8px', borderRadius: '12px' }}>🏥</span>
            <div>
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: '700', color: '#1e293b', lineHeight: '1.2' }}>ระบบจองนัดหมาย</h1>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '400' }}>เจ้าหน้าที่ลงพื้นที่หน้างาน</p>
            </div>
          </div>

          {/* แถบเมนูด้านบน */}
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: view === 'calendar' ? '#3b82f6' : 'transparent',
                color: view === 'calendar' ? '#ffffff' : '#475569',
              }}
              onClick={() => setView('calendar')}
            >
              📅 ปฏิทิน
            </button>
            
            <button
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                backgroundColor: view === 'book' ? '#3b82f6' : 'transparent',
                color: view === 'book' ? '#ffffff' : '#475569',
              }}
              onClick={() => { setSelectedDate(null); setView('book') }}
            >
              ✏️ จองนัด
            </button>
            
            {/* ปุ่มเข้าหลังบ้าน (สีพิเศษเพื่อให้เจ้าหน้าที่สังเกตง่าย และเช็กสเตตล็อกอิน) */}
            {!isAuthenticated ? (
              <button
                style={{
                  padding: '8px 16px', borderRadius: '8px', fontWeight: '500', fontSize: '14px', cursor: 'pointer', transition: 'all 0.2s',
                  border: view === 'login' || view === 'admin' ? 'none' : '1px solid #e2e8f0',
                  backgroundColor: view === 'login' || view === 'admin' ? '#0f172a' : '#ffffff',
                  color: view === 'login' || view === 'admin' ? '#ffffff' : '#1e293b',
                }}
                onClick={handleAdminNavClick}
              >
                🔑 สำหรับเจ้าหน้าที่
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer',
                    backgroundColor: view === 'admin' ? '#0f172a' : '#f1f5f9',
                    color: view === 'admin' ? '#ffffff' : '#1e293b',
                  }}
                  onClick={() => setView('admin')}
                >
                  ⚙️ แผงจัดการงาน
                </button>
                <button
                  style={{
                    padding: '8px 12px', borderRadius: '8px', border: 'none', fontWeight: '500', fontSize: '14px', cursor: 'pointer',
                    backgroundColor: '#fee2e2', color: '#ef4444'
                  }}
                  onClick={handleLogout}
                >
                  🚪 ออกระบบ
                </button>
              </div>
            )}
          </nav>

        </div>
      </header>

      {/* 💻 โซนเนื้อหาหลักกลางหน้าจอ */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 20px' }}>
        
        {/* หน้าปฏิทิน */}
        {view === 'calendar' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <Calendar key={refreshKey} onDateSelect={handleDateSelect} />
          </div>
        )}

        {/* หน้ากรอกข้อมูลแบบฟอร์มจองนัด (เด้งมาหน้านี้เดี่ยว ๆ ตามสไตล์เดิมของคุณ) */}
        {view === 'book' && (
          <div style={{ maxWidth: '650px', margin: '0 auto', backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ borderBottom: '1px solid #f1f5f9', paddingBottom: '16px', marginBottom: '24px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>✍️ กรอกรายละเอียดข้อมูลการจอง</h2>
              <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>โปรดระบุข้อมูลส่วนตัวและเลือกอุปกรณ์ที่ต้องการจองนัดหมาย</p>
            </div>
            <BookingForm
              preSelectedDate={selectedDate}
              onComplete={handleBookingComplete}
              onCancel={() => setView('calendar')}
            />
          </div>
        )}

        {/* หน้าจอฟอร์ม Login สำหรับพยาบาล */}
        {view === 'login' && (
          <div style={{ maxWidth: '400px', margin: '60px auto', backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span style={{ fontSize: '36px' }}>🔑</span>
              <h2 style={{ margin: '12px 0 4px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>ระบบเข้าสู่หลังบ้าน</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>สำหรับเจ้าหน้าที่พยาบาลและแอดมินเท่านั้น</p>
            </div>
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: '500', color: '#475569' }}>กรอกรหัสผ่านเพื่อยืนยันตัวตน:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="รหัสผ่าน (พยาบาล)"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', fontSize: '14px' }}
                  required
                />
              </div>
              {loginError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 16px 0', fontWeight: '500' }}>{loginError}</p>}
              <button 
                type="submit" 
                style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', fontSize: '14px' }}
              >
                เข้าสู่หน้าจัดการงาน
              </button>
            </form>
          </div>
        )}

        {/* หน้าแผงควบคุมเจ้าหน้าที่ (Admin) */}
        {view === 'admin' && (
          <div style={{ backgroundColor: '#ffffff', padding: '24px', borderRadius: '16px', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)' }}>
            <AdminPanel onRefresh={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {/* หน้าแจ้งเตือนเมื่อจองนัดสำเร็จ */}
        {view === 'success' && (
          <div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
            <BookingSuccess
              booking={successData}
              onBackToCalendar={() => setView('calendar')}
              onNewBooking={() => { setSuccessData(null); setView('book') }}
            />
          </div>
        )}
      </main>
    </div>
  )
}
