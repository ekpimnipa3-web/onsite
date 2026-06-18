import { useState } from 'react'
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
  const [showPassword, setShowPassword] = useState(false) // เปิด-ปิดตาดูกระจกรหัส
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginError, setLoginError] = useState('')

  const ADMIN_PASSWORD = 'nurse1234'

  const handleBookingComplete = (booking) => {
    setSuccessData(booking)
    setView('success')
    setRefreshKey(k => k + 1)
  }

  const handleDateSelect = (date) => {
    setSelectedDate(date)
    setView('book')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setView('admin')
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

  const handleAdminNavClick = () => {
    if (isAuthenticated) {
      setView('admin')
    } else {
      setView('login')
    }
  }

  return (
    <div style={{ backgroundColor: '#f4f7fa', minHeight: '100vh', fontFamily: "'Sarabun', sans-serif", color: '#1e293b' }}>
      
      {/* 🧭 PREMIUM GLASSMORPHIC HEADER */}
      <header style={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)', 
        position: 'sticky', 
        top: 0, 
        zIndex: 100,
        boxShadow: '0 4px 20px -5px rgba(15, 23, 42, 0.03)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', height: '80px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          
          {/* Brand Logo & Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', cursor: 'pointer' }} onClick={() => setView('calendar')}>
            <div style={{ 
              fontSize: '26px', 
              background: 'linear-gradient(135deg, #e0f2fe 0%, #dbeafe 100%)', 
              padding: '10px', 
              borderRadius: '16px',
              boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.4), 0 4px 12px rgba(59, 130, 246, 0.08)'
            }}>
              🏥
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '18px', fontWeight: '800', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                ระบบจองนัดหมาย
              </h1>
              <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#64748b', fontWeight: '500', letterSpacing: '0.5px' }}>
                เจ้าหน้าที่ลงพื้นที่หน้างาน
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={{ display: 'flex', gap: '8px', alignItems: 'center', backgroundColor: '#f1f5f9', padding: '6px', borderRadius: '14px' }}>
            <button
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s ease',
                backgroundColor: view === 'calendar' ? '#ffffff' : 'transparent',
                color: view === 'calendar' ? '#1e40af' : '#64748b',
                boxShadow: view === 'calendar' ? '0 4px 12px rgba(15, 23, 42, 0.05)' : 'none'
              }}
              onClick={() => setView('calendar')}
            >
              📅 ปฏิทิน
            </button>
            
            <button
              style={{
                padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s ease',
                backgroundColor: view === 'book' ? '#ffffff' : 'transparent',
                color: view === 'book' ? '#1e40af' : '#64748b',
                boxShadow: view === 'book' ? '0 4px 12px rgba(15, 23, 42, 0.05)' : 'none'
              }}
              onClick={() => { setSelectedDate(null); setView('book') }}
            >
              ✏️ จองนัด
            </button>
            
            <div style={{ width: '1px', height: '20px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

            {!isAuthenticated ? (
              <button
                style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s ease',
                  backgroundColor: view === 'login' || view === 'admin' ? '#1e3a8a' : 'transparent',
                  color: view === 'login' || view === 'admin' ? '#ffffff' : '#475569',
                  boxShadow: view === 'login' || view === 'admin' ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none'
                }}
                onClick={handleAdminNavClick}
              >
                🔑 สำหรับเจ้าหน้าที่
              </button>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button
                  style={{
                    padding: '10px 16px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer', transition: 'all 0.25s ease',
                    backgroundColor: view === 'admin' ? '#1e3a8a' : 'transparent',
                    color: view === 'admin' ? '#ffffff' : '#475569',
                    boxShadow: view === 'admin' ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none'
                  }}
                  onClick={() => setView('admin')}
                >
                  ⚙️ แผงจัดการงาน
                </button>
                <button
                  style={{
                    padding: '10px 14px', borderRadius: '10px', border: 'none', fontWeight: '600', fontSize: '14px', cursor: 'pointer',
                    backgroundColor: '#fee2e2', color: '#ef4444', transition: 'all 0.2s'
                  }}
                  onClick={handleLogout}
                  title="ออกจากระบบ"
                >
                  🚪
                </button>
              </div>
            )}
          </nav>

        </div>
      </header>

      {/* 💻 MAIN CONTAINER */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
        
        {/* หน้าปฏิทิน */}
        {view === 'calendar' && (
          <div style={{ 
            backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', 
            boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.04), 0 1px 3px rgba(15, 23, 42, 0.02)',
            border: '1px solid rgba(241, 245, 249, 0.8)'
          }}>
            <Calendar key={refreshKey} onDateSelect={handleDateSelect} />
          </div>
        )}

        {/* หน้าแบบฟอร์มกรอกข้อมูลการจอง */}
        {view === 'book' && (
          <div style={{ 
            maxWidth: '680px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', 
            borderRadius: '24px', boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.06)',
            border: '1px solid rgba(241, 245, 249, 0.8)'
          }}>
            <div style={{ borderBottom: '2px solid #f1f5f9', paddingBottom: '20px', marginBottom: '28px' }}>
              <h2 style={{ margin: 0, fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>✍️ ข้อมูลการจองนัดหมาย</h2>
              <p style={{ margin: '6px 0 0 0', fontSize: '14px', color: '#64748b' }}>โปรดตรวจสอบวันนัดหมาย กรอกประวัติตนเอง และอุปกรณ์แพทย์ที่ประสงค์ขอใช้งาน</p>
            </div>
            <BookingForm
              preSelectedDate={selectedDate}
              onComplete={handleBookingComplete}
              onCancel={() => setView('calendar')}
            />
          </div>
        )}

        {/* หน้าจอความปลอดภัยล็อกอินแอดมินพยาบาล */}
        {view === 'login' && (
          <div style={{ 
            maxWidth: '420px', margin: '60px auto', backgroundColor: '#ffffff', padding: '40px', 
            borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.08)',
            border: '1px solid rgba(241, 245, 249, 0.9)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{ width: '72px', height: '72px', backgroundColor: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                <span style={{ fontSize: '32px' }}>🔒</span>
              </div>
              <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: '800', color: '#0f172a' }}>พื้นที่เฉพาะเจ้าหน้าที่</h2>
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', fontWeight: '500' }}>กรอกรหัสยืนยันตนเพื่อเปิดแดชบอร์ดพยาบาล</p>
            </div>
            
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '13px', fontWeight: '600', color: '#334155' }}>รหัสผ่านความปลอดภัย:</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{ 
                      width: '100%', padding: '12px 45px 12px 16px', borderRadius: '12px', 
                      border: '1.5px solid #cbd5e1', outline: 'none', boxSizing: 'border-box', 
                      fontSize: '15px', transition: 'all 0.2s', backgroundColor: '#f8fafc'
                    }}
                    required
                  />
                  {/* ปุ่มกดเปิดปิดรูปตา ดูรหัสผ่าน */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', fontSize: '16px', color: '#64748b' }}
                  >
                    {showPassword ? "👁️" : "🙈"}
                  </button>
                </div>
              </div>
              {loginError && <p style={{ color: '#ef4444', fontSize: '13px', margin: '0 0 20px 0', fontWeight: '600', textAlign: 'center' }}>{loginError}</p>}
              <button 
                type="submit" 
                style={{ 
                  width: '100%', padding: '12px', backgroundColor: '#1e3a8a', color: '#ffffff', 
                  border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', 
                  fontSize: '15px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.15)', transition: 'all 0.2s' 
                }}
              >
                ยืนยันเพื่อเข้าสู่ระบบ
              </button>
            </form>
          </div>
        )}

        {/* หน้าจัดการงานหลักหลังบ้าน */}
        {view === 'admin' && (
          <div style={{ 
            backgroundColor: '#ffffff', padding: '32px', borderRadius: '24px', 
            boxShadow: '0 10px 30px -5px rgba(15, 23, 42, 0.04)',
            border: '1px solid rgba(241, 245, 249, 0.8)'
          }}>
            <AdminPanel onRefresh={() => setRefreshKey(k => k + 1)} />
          </div>
        )}

        {/* หน้าจอบันทึกสำเร็จ */}
        {view === 'success' && (
          <div style={{ 
            maxWidth: '580px', margin: '0 auto', backgroundColor: '#ffffff', padding: '40px', 
            borderRadius: '24px', boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.05)' 
          }}>
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
