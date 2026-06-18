# 🏥 ระบบจองนัดหมายเจ้าหน้าที่ลงพื้นที่

ระบบจองนัดหมายสำหรับให้เจ้าหน้าที่ลงพื้นที่หน้างาน พร้อมปฏิทินแสดงความพร้อมใช้งาน

## ✨ ฟีเจอร์หลัก

- **จองนัดหมาย** — กรอกชื่อ เบอร์ วันที่ เลือกบริการ + จำนวน คำนวณระยะเวลาอัตโนมัติ
- **ปฏิทินสาธารณะ** — ทุกคนเห็นว่าเจ้าหน้าที่ว่าง/ไม่ว่างในแต่ละวัน
- **จัดการสถานะ** — เจ้าหน้าที่เปลี่ยนสถานะ: รอยืนยัน → ยืนยันแล้ว → เสร็จสิ้น
- **กันการจองซ้อน** — ตรวจสอบช่วงเวลาที่ถูกจองแล้วอัตโนมัติ

## 🛠️ เทคโนโลยี

| ส่วน | เทคโนโลยี |
|------|-----------|
| Frontend | React + Vite |
| Database | Supabase (PostgreSQL) |
| Hosting | GitHub Pages |
| Auto-deploy | GitHub Actions |

---

## 🚀 วิธี Deploy (ทำครั้งเดียว)

### ขั้นที่ 1 — ตั้งค่า Supabase

1. ไปที่ [supabase.com](https://supabase.com) → สร้างโปรเจกต์ใหม่
2. ไปที่ **SQL Editor** → วางโค้ดจากไฟล์ `supabase-schema.sql` → กด **Run**
3. ไปที่ **Settings → API** → จด:
   - `Project URL` (หน้าตา: `https://xxxx.supabase.co`)
   - `anon public` key

### ขั้นที่ 2 — ตั้งค่า GitHub Repository

1. สร้าง repo ใหม่บน GitHub (public หรือ private ก็ได้)
2. Push โค้ดขึ้น:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

3. ไปที่ **Settings → Secrets and variables → Actions** → เพิ่ม secrets:
   - `VITE_SUPABASE_URL` = Project URL จาก Supabase
   - `VITE_SUPABASE_ANON_KEY` = anon key จาก Supabase

4. ไปที่ **Settings → Pages** → Source: **GitHub Actions**

5. ไปที่ **Actions** tab → เลือก workflow → กด **Run workflow**

🎉 เว็บจะขึ้นที่ `https://YOUR_USERNAME.github.io/YOUR_REPO/`

---

## 💻 รัน Local

```bash
# 1. Copy ไฟล์ env
cp .env.example .env
# แก้ไข .env ใส่ค่าจริงจาก Supabase

# 2. ติดตั้ง dependencies
npm install

# 3. รัน dev server
npm run dev
```

---

## 📋 บริการและระยะเวลา

| บริการ | เวลา/ชิ้น |
|--------|----------|
| เครื่องวัดความดัน | 30 นาที |
| เครื่องวัดออกซิเจน | 20 นาที |
| อุปกรณ์อื่น ๆ | 30 นาที |

ระบบคำนวณอัตโนมัติ เช่น เครื่องวัดความดัน 3 ชิ้น = 90 นาที

## 🔄 สถานะการจอง

```
รอยืนยัน (🟡) → ยืนยันแล้ว (🔵) → เสร็จสิ้น (🟢)
                ↘ ยกเลิก (🔴)
```

---

## 📁 โครงสร้างไฟล์

```
src/
├── components/
│   ├── BookingForm.jsx     # ฟอร์มจองนัด
│   ├── Calendar.jsx        # ปฏิทินแสดงผล
│   ├── AdminPanel.jsx      # หน้าจัดการ (เจ้าหน้าที่)
│   └── BookingSuccess.jsx  # หน้ายืนยันสำเร็จ
├── lib/
│   ├── supabase.js         # Supabase client
│   └── services.js         # ค่าคงที่บริการ + utility functions
├── App.jsx                 # Main app + routing
└── index.css               # Global styles
```

## ⚙️ เพิ่ม/แก้บริการ

แก้ไขที่ `src/lib/services.js`:

```js
export const SERVICES = [
  { id: 'bp_machine', name: 'เครื่องวัดความดัน', durationMinutes: 30, icon: '🩺' },
  { id: 'oximeter', name: 'เครื่องวัดออกซิเจน', durationMinutes: 20, icon: '💉' },
  // เพิ่มบริการใหม่ที่นี่
  { id: 'ecg', name: 'เครื่อง ECG', durationMinutes: 45, icon: '❤️' },
]
```
