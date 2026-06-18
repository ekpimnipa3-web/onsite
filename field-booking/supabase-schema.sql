-- =============================================
-- SUPABASE SQL SCHEMA
-- วิ่งใน Supabase Dashboard > SQL Editor
-- =============================================

-- 1. สร้างตาราง bookings
create table if not exists public.bookings (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),

  customer_name  text not null,
  phone          text not null,
  booking_date   date not null,
  start_time     time not null,
  end_time       time not null,

  -- services เก็บเป็น JSON array เช่น [{"id":"bp_machine","quantity":2}]
  services    jsonb not null default '[]',

  notes       text,
  status      text not null default 'pending'
    check (status in ('pending','confirmed','completed','cancelled'))
);

-- 2. Index สำหรับ query เร็วขึ้น
create index if not exists idx_bookings_date    on public.bookings(booking_date);
create index if not exists idx_bookings_status  on public.bookings(status);

-- 3. Row Level Security
alter table public.bookings enable row level security;

-- อนุญาตให้ทุกคน (anon) อ่านได้ (สำหรับปฏิทิน)
create policy "Anyone can view bookings"
  on public.bookings for select
  using (true);

-- อนุญาตให้ทุกคนสร้างการจองได้
create policy "Anyone can insert booking"
  on public.bookings for insert
  with check (true);

-- อนุญาตให้ update ได้ (สำหรับเจ้าหน้าที่เปลี่ยนสถานะ)
-- หมายเหตุ: ในระบบจริงควรจำกัดด้วย auth role
create policy "Anyone can update status"
  on public.bookings for update
  using (true);

-- 4. ตัวอย่างข้อมูล (optional)
-- insert into public.bookings (customer_name, phone, booking_date, start_time, end_time, services, status)
-- values
--   ('สมชาย ใจดี', '081-234-5678', current_date + 1, '09:00', '10:00',
--    '[{"id":"bp_machine","quantity":2}]', 'confirmed'),
--   ('สมหญิง รักดี', '089-876-5432', current_date + 2, '13:00', '13:30',
--    '[{"id":"oximeter","quantity":1}]', 'pending');

-- =============================================
-- เสร็จแล้ว! ไปที่ Settings > API เพื่อ copy
-- Project URL และ anon public key
-- =============================================
