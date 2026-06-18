import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase'; // เชื่อมต่อฐานข้อมูล
import dayjs from 'dayjs'; // จัดการวันที่
import 'dayjs/locale/th'; // ใช้ภาษาไทยสำหรับแสดงผลชื่อเดือน

// ตั้งค่าให้ dayjs ใช้ภาษาไทย
dayjs.locale('th');

function Calendar() {
  const [bookings, setBookings] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs('2026-06-18')); // ล็อกไว้ที่มิถุนายน 2569 ตามรูปของคุณ
  const [selectedDate, setSelectedDate] = useState('2026-06-18'); // ค่าเริ่มต้นวันที่เลือก (เช่น วันที่ 18)
  const [loading, setLoading] = useState(true);

  // 1. ดึงข้อมูลจาก Supabase ทั้งหมดมาเก็บไว้ใน State
  useEffect(() => {
    async function fetchBookings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .order('start_time', { ascending: true }); // เรียงจากเช้าไปเย็น

        if (error) throw error;
        setBookings(data || []);
      } catch (err) {
        console.error('Error fetching bookings:', err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  // 2. ฟังก์ชันคำนวณวันในเดือนมิถุนายน 2569 (จำนวน 30 วัน) เพื่อวาดปฏิทิน
  const generateDaysInMonth = () => {
    const days = [];
    // สร้าง Array วันที่ 1 ถึง 30 ของเดือนมิถุนายน 2026
    for (let i = 1; i <= 30; i++) {
      const dateStr = `2026-06-${String(i).padStart(2, '0')}`;
      days.push(dateStr);
    }
    return days;
  };

  const daysInMonth = generateDaysInMonth();

  // 3. ตรรกะสำคัญ: กรองคิวจอง "เฉพาะวันที่ถูกเลือก (selectedDate)" มาแสดงผลข้างล่าง
  const filteredBookings = bookings.filter((booking) => {
    // แปลงวันที่จากฐานข้อมูลให้อยู่ในรูปแบบ YYYY-MM-DD เพื่อเอามาเปรียบเทียบกันให้แม่นยำ
    const dbDate = dayjs(booking.booking_date).format('YYYY-MM-DD');
    return dbDate === selectedDate;
  });

  // 4. ฟังก์ชันเช็กสถานะการจองเพื่อเอาไปวาด "จุดสีแจ้งเตือน" บนปฏิทิน
  const getStatusDots = (dateStr) => {
    const dayBookings = bookings.filter(
      (b) => dayjs(b.booking_date).format('YYYY-MM-DD') === dateStr
    );
    
    return {
      hasPending: dayBookings.some((b) => b.status === 'pending'),
      hasConfirmed: dayBookings.some((b) => b.status === 'confirmed'),
      hasCompleted: dayBookings.some((b) => b.status === 'completed'),
    };
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '40px', fontFamily: 'Sarabun' }}>กำลังโหลดข้อมูลปฏิทิน...</div>;
  }

  return (
    <div style={{ fontFamily: 'Sarabun, sans-serif', color: '#333' }}>
      
      {/* --- ส่วนหัวปฏิทิน --- */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📅 {currentMonth.format('MMMM YYYY')}
        </h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>◀</button>
          <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>วันนี้</button>
          <button style={{ padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', backgroundColor: '#fff', cursor: 'pointer' }}>▶</button>
        </div>
      </div>

      {/* คำอธิบายสัญลักษณ์สีสถานะ */}
      <div style={{ display: 'flex', gap: '15px', fontSize: '14px', marginBottom: '15px', color: '#6b7280' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#f59e0b', borderRadius: '50%' }}></span> รอยืนยัน</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#3b82f6', borderRadius: '50%' }}></span> ยืนยันแล้ว</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', backgroundColor: '#10b981', borderRadius: '50%' }}></span> เสร็จสิ้น</span>
      </div>

      {/* --- ส่วนตารางปฏิทิน (Grid 7 คอลัมน์) --- */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px', marginBottom: '25px' }}>
        
        {/* หัววัน อา. - ส. */}
        {['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'].map((d) => (
          <div key={d} style={{ textAlign: 'center', fontWeight: '500', color: '#6b7280', paddingBottom: '5px', fontSize: '14px' }}>
            {d}
          </div>
        ))}

        {/* ช่องวันที่ 1 - 30 */}
        {daysInMonth.map((dateStr) => {
          const isSelected = dateStr === selectedDate; // เช็กว่าช่องนี้คือวันที่ยูสเซอร์เลือกอยู่ไหม
          const dayNum = dayjs(dateStr).date();
          const dots = getStatusDots(dateStr);

          return (
            <div
              key={dateStr}
              // 🔥 จุดสำคัญมาก: เมื่อกดคลิก ให้เปลี่ยนค่า selectedDate เป็นของช่องนี้ทันที
              onClick={() => setSelectedDate(dateStr)}
              style={{
                border: isSelected ? '2px solid #4f46e5' : '1px solid #f3f4f6', 
                backgroundColor: isSelected ? '#f5f3ff' : '#fff', // เปลี่ยนสีพื้นหลังไฮไลท์เมื่อถูกคลิกเลือก
                padding: '12px',
                borderRadius: '10px',
                cursor: 'pointer',
                minHeight: '75px',
                transition: 'all 0.2s',
                boxShadow: isSelected ? '0 4px 6px -1px rgba(79, 70, 229, 0.1)' : 'none'
              }}
            >
              <div style={{ fontWeight: isSelected ? 'bold' : 'normal', color: isSelected ? '#4f46e5' : '#1f2937' }}>
                {dayNum}
              </div>
              
              {/* จุดไข่ปลาแสดงสถานะการจองใต้ตัวเลขวันที่ */}
              <div style={{ display: 'flex', gap: '4px', marginTop: '10px' }}>
                {dots.hasPending && <span style={{ width: '6px', height: '6px', backgroundColor: '#f59e0b', borderRadius: '50%' }} title="มีงานรอยืนยัน"></span>}
                {dots.hasConfirmed && <span style={{ width: '6px', height: '6px', backgroundColor: '#3b82f6', borderRadius: '50%' }} title="มีงานยืนยันแล้ว"></span>}
                {dots.hasCompleted && <span style={{ width: '6px', height: '6px', backgroundColor: '#10b981', borderRadius: '50%' }} title="มีงานเสร็จสิ้น"></span>}
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ส่วนที่ 3: กล่องแสดงรายการคิวงานด้านล่างปฏิทิน --- */}
      <div style={{ border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px', borderBottom: '1px solid #f3f4f6', paddingBottom: '12px' }}>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600' }}>
            📋 รายการนัด — วันที่ {dayjs(selectedDate).format('D MMMM YYYY')}
          </h3>
          <button style={{ backgroundColor: '#000', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
            + จองวันนี้
          </button>
        </div>

        {/* เงื่อนไขแสดงผล: ถ้าไม่มีคิวจองในวันที่เลือก */}
        {filteredBookings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>
            <span style={{ fontSize: '32px' }}>📬</span>
            <p style={{ marginTop: '10px', margin: 0, fontSize: '15px' }}>ยังไม่มีการจองในวันนี้</p>
          </div>
        ) : (
          /* ถ้ามีคิวจอง: ทำการวนลูป (Map) แสดงคิวออกมาเป็นแถวๆ */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  padding: '14px 18px', 
                  border: '1px solid #f3f4f6', 
                  borderRadius: '10px',
                  backgroundColor: '#f9fafb'
                }}
              >
                <div>
                  <div style={{ fontWeight: '600', color: '#111827', marginBottom: '4px', fontSize: '15px' }}>
                    ⏰ เวลา {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)} น.
                  </div>
                  <div style={{ color: '#4b5563', fontSize: '14px' }}>
                    👤 ผู้จอง: {booking.customer_name} | 📞 โทร: {booking.phone}
                  </div>
                  {booking.notes && (
                    <div style={{ color: '#9ca3af', fontSize: '12px', marginTop: '4px' }}>
                      📝 หมายเหตุ: {booking.notes}
                    </div>
                  )}
                </div>
                <div>
                  {booking.status === 'pending' && <span style={{ color: '#d97706', backgroundColor: '#fef3c7', padding: '5px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>รอยืนยัน 🟡</span>}
                  {booking.status === 'confirmed' && <span style={{ color: '#2563eb', backgroundColor: '#dbeafe', padding: '5px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>ยืนยันแล้ว 🔵</span>}
                  {booking.status === 'completed' && <span style={{ color: '#059669', backgroundColor: '#d1fae5', padding: '5px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>เสร็จสิ้น 🟢</span>}
                  {booking.status === 'cancelled' && <span style={{ color: '#dc2626', backgroundColor: '#fee2e2', padding: '5px 10px', borderRadius: '20px', fontSize: '13px', fontWeight: '500' }}>ยกเลิก 🔴</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default Calendar;
