import React, { useState } from 'react';
import Calendar from './components/Calendar';
import BookingForm from './components/BookingForm';
import AdminPanel from './components/AdminPanel';

function App() {
  const [view, setView] = useState('user'); // สถานะหน้าจอปัจจุบัน: 'user', 'login', 'admin'
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // 🔒 กำหนดรหัสผ่านสำหรับเจ้าหน้าที่พยาบาลตรงนี้ (สามารถเปลี่ยนตามต้องการได้)
  const ADMIN_PASSWORD = 'nurse1234'; 

  // ฟังก์ชันล็อกอิน
  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setView('admin'); // ล็อกอินผ่านแล้วให้เด้งไปหน้าแอดมินทันที
      setError('');
      setPassword('');
    } else {
      setError('❌ รหัสผ่านไม่ถูกต้อง สำหรับเจ้าหน้าที่พยาบาลเท่านั้น');
    }
  };

  // ฟังก์ชันออกจากระบบ
  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('user');
  };

  return (
    <div style={{ fontFamily: 'Sarabun, sans-serif', backgroundColor: '#f8fafc', minHeight: '100vh', padding: '20px' }}>
      
      {/* 🧭 แถบเมนูด้านบน (Navbar) */}
      <header style={{ 
        maxWidth: '1200px', margin: '0 auto 20px auto', display: 'flex', 
        justifyContent: 'space-between', alignItems: 'center', 
        backgroundColor: '#fff', padding: '15px 25px', borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}>
        <h1 style={{ fontSize: '1.25rem', margin: 0, color: '#1e293b', cursor: 'pointer' }} onClick={() => setView('user')}>
          🏥 ระบบจองนัดหมายเจ้าหน้าที่ลงพื้นที่
        </h1>
        <div>
          <button 
            onClick={() => setView('user')} 
            style={{ 
              marginRight: '10px', padding: '8px 16px', borderRadius: '8px', 
              border: 'none', backgroundColor: view === 'user' ? '#3b82f6' : 'transparent',
              color: view === 'user' ? '#fff' : '#475569', cursor: 'pointer', fontWeight: '500'
            }}
          >
            📊 หน้าปฏิทิน / จองนัด
          </button>
          
          {!isAuthenticated ? (
            <button 
              onClick={() => setView('login')} 
              style={{ 
                padding: '8px 16px', borderRadius: '8px', border: '1px solid #e2e8f0',
                backgroundColor: view === 'login' ? '#0f172a' : '#fff',
                color: view === 'login' ? '#fff' : '#0f172a', cursor: 'pointer', fontWeight: '500'
              }}
            >
              🔑 สำหรับเจ้าหน้าที่
            </button>
          ) : (
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                backgroundColor: '#ef4444', color: '#fff', cursor: 'pointer', fontWeight: '500'
              }}
            >
              🚪 ออกจากระบบ
            </button>
          )}
        </div>
      </header>

      {/* 💻 ส่วนเนื้อหาหลักเปลี่ยนตามสถานะหน้าจอ (View) */}
      <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
        
/* หน้าที่ 1: หน้าบุคคลทั่วไป (ดูปฏิทิน / จองคิว) */
        {view === 'user' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>
            
            {/* ซีกที่ 1: แสดงปฏิทิน */}
            <div style={{ backgroundColor: '#fff', padding: '25px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <Calendar />
            </div>

            {/* ซีกที่ 2: ฟอร์มกรอกข้อมูลจองคิวที่หายไป เอากลับมาตรงนี้แล้วครับ ✨ */}
            <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '16px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '20px', fontSize: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                ✍️ ฟอร์มกรอกรายละเอียดการจองนัดหมาย
              </h2>
              <BookingForm />
            </div>

          </div>
        )}

        {/* หน้าที่ 2: หน้าแบบฟอร์มตรวจสอบรหัสผ่านก่อนเข้าหลังบ้าน */}
        {view === 'login' && (
          <div style={{ 
            maxWidth: '400px', margin: '60px auto', backgroundColor: '#fff', 
            padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
          }}>
            <h2 style={{ fontSize: '1.2rem', marginTop: 0, marginBottom: '20px', textAlign: 'center' }}>🔑 สำหรับเจ้าหน้าที่พยาบาล</h2>
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', color: '#475569' }}>กรุณากรอกรหัสผ่านเพื่อเข้าสู่ระบบ:</label>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ใส่รหัสผ่านที่นี่..."
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
                  required
                />
              </div>
              {error && <p style={{ color: '#ef4444', fontSize: '14px', margin: '0 0 15px 0' }}>{error}</p>}
              <button 
                type="submit" 
                style={{ width: '100%', padding: '10px', backgroundColor: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
              >
                ยืนยันเพื่อเข้าสู่หน้าจัดการ
              </button>
            </form>
          </div>
        )}

        {/* หน้าที่ 3: แผงควบคุมเจ้าหน้าที่ (Admin Panel) - ล็อกไว้ว่าต้องล็อกอินผ่านแล้วเท่านั้น */}
        {view === 'admin' && (
          <div>
            {isAuthenticated ? (
              <AdminPanel />
            ) : (
              <p style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>⚠️ คุณไม่มีสิทธิ์เข้าถึงหน้านี้ กรุณาล็อกอินก่อน</p>
            )}
          </div>
        )}

      </main>
    </div>
  );
}

export default App;
