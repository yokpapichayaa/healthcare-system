# Agnos Patient System

ระบบลงทะเบียนผู้ป่วยและติดตามข้อมูลแบบ Real-Time — พัฒนาขึ้นเป็นส่วนหนึ่งของ **Agnos Frontend Developer Candidate Assignment**

ระบบประกอบด้วยสองส่วนหลักที่ทำงานประสานกัน: **Patient Form** สำหรับให้ผู้ป่วยกรอกข้อมูลส่วนตัว และ **Staff View** สำหรับให้เจ้าหน้าที่ทางการแพทย์ติดตามข้อมูลที่กำลังถูกกรอก โดยไม่ต้องรีเฟรชหน้าเพจ

---

## Live Demo

| ส่วนงาน | URL |
|---------|-----|
| 👤 Patient Form | `https://healthcare-system-lyart.vercel.app/patient` |
| 🖥 Staff View | `https://healthcare-system-lyart.vercel.app/staff` |

> **ทดสอบ Real-Time Sync:** เปิดทั้งสอง URL ในแท็บแยกกันพร้อมกัน ทุกการพิมพ์บน Patient Form จะปรากฏบน Staff View ทันที

---

## ฟีเจอร์

### ฟีเจอร์หลัก (ตาม Assignment)
- **Patient Registration Form** — ฟอร์ม 13 ช่องครอบคลุมข้อมูลส่วนตัว ข้อมูลติดต่อ ผู้ติดต่อฉุกเฉิน และข้อมูลเสริม
- **Real-Time Staff Monitor** — แสดงทุกการพิมพ์ของผู้ป่วยทันทีผ่าน WebSocket (ไม่ใช้ polling)
- **Form Validation** — ตรวจสอบช่องบังคับ รูปแบบอีเมล และรูปแบบเบอร์โทร แสดง error แบบ progressive หลัง blur
- **Patient Status Tracking** — 3 สถานะ (`Inactive` / `Filling In` / `Submitted`) ตรวจจับอัตโนมัติแบบ real-time
- **Responsive Design** — Mobile-first รองรับทุกขนาดหน้าจอตั้งแต่ 375px (iPhone SE) ถึง 1440px (Desktop)

### ฟีเจอร์เพิ่มเติม (Bonus)
- **Inactivity Detection** — หากผู้ป่วยหยุดพิมพ์นาน 6 วินาที สถานะจะเปลี่ยนเป็น `Inactive` อัตโนมัติ ช่วยให้เจ้าหน้าที่แยกแยะระหว่าง "กำลังคิด" กับ "ออกจากหน้าแล้ว"
- **Animated Field Highlights** — ช่องที่ได้รับข้อมูลใหม่บน Staff View จะแสดง pulse สีเขียวนาน 0.9 วินาที ช่วยให้เจ้าหน้าที่สังเกตเห็นการเปลี่ยนแปลงได้ทันที
- **SVG Progress Ring** — วงกลมแสดงความคืบหน้าเปอร์เซ็นต์ที่กรอกแล้ว มองเห็นได้ในทันที
- **TypeScript ตลอดทั้งโปรเจกต์** — กำหนด interface ครบถ้วน ป้องกัน bug ตั้งแต่ compile time
- **Dark Clinical Theme** — ออกแบบสีเพื่อลดความเมื่อยล้าของสายตาในสภาพแวดล้อมคลินิก

---

## Tech Stack

| Layer | เทคโนโลยี | เหตุผลที่เลือก |
|-------|-----------|---------------|
| Framework | [Next.js 14](https://nextjs.org) (App Router) | File-based routing, API routes ฝั่ง server, รองรับ TypeScript ได้ดี |
| Language | TypeScript | ความปลอดภัยในการ compile ครอบคลุมทุก component, hook, และ API |
| Styling | [TailwindCSS](https://tailwindcss.com) | Utility-first ทำให้ responsive design รวดเร็วและไม่มี CSS conflict |
| Real-Time | [Pusher Channels](https://pusher.com) | WebSocket infrastructure สำเร็จรูป รองรับ serverless บน Vercel |
| Fonts | DM Sans + DM Serif Display | ผสมระหว่าง serif สำหรับ heading และ sans-serif สำหรับ body ให้ความรู้สึกเป็นมืออาชีพ |
| Deployment | [Vercel](https://vercel.com) | Deploy Next.js ได้โดยไม่ต้องตั้งค่าเพิ่ม, HTTPS อัตโนมัติ, CDN ทั่วโลก |

---

## โครงสร้างโปรเจกต์

```
agnos-patient-system/
├── src/
│   ├── app/                          # Next.js App Router — หน้าเพจและ API
│   │   ├── layout.tsx                # Root layout: โหลด Fonts, Navbar, background, viewport meta
│   │   ├── page.tsx                  # Redirect: / → /patient
│   │   ├── globals.css               # Tailwind directives + global styles
│   │   ├── patient/
│   │   │   └── page.tsx              # Route: /patient — หน้าลงทะเบียนผู้ป่วย
│   │   ├── staff/
│   │   │   └── page.tsx              # Route: /staff — หน้าติดตามข้อมูลเจ้าหน้าที่
│   │   └── api/
│   │       └── sync/
│   │           └── route.ts          # POST /api/sync — รับข้อมูลและ trigger Pusher event
│   │
│   ├── components/
│   │   ├── ui/                       # Shared components ใช้ร่วมกันทั้งสองหน้า
│   │   │   ├── Navbar.tsx            # Navigation bar แบบ sticky พร้อม tab switcher
│   │   │   ├── FormField.tsx         # แสดงหนึ่งช่องฟอร์ม: label + input + error
│   │   │   └── StatusBadge.tsx       # แสดงสถานะผู้ป่วย + SVG progress ring
│   │   ├── patient/                  # Components สำหรับ Patient interface
│   │   │   ├── PatientForm.tsx       # ฟอร์มหลัก — วนลูป FORM_SECTIONS ผ่าน usePatientForm
│   │   │   └── SuccessScreen.tsx     # หน้ายืนยันหลัง submit สำเร็จ
│   │   └── staff/                    # Components สำหรับ Staff interface
│   │       ├── StaffView.tsx         # Dashboard หลัก — subscribe ผ่าน useRealtimeSync
│   │       └── StaffFieldGrid.tsx    # แสดงการ์ดข้อมูลแต่ละช่องพร้อม animation highlight
│   │
│   ├── hooks/
│   │   ├── usePatientForm.ts         # จัดการ form state, validation, timer, broadcasting
│   │   └── useRealtimeSync.ts        # Subscribe Pusher + ติดตามว่า key ไหนเพิ่งเปลี่ยน
│   │
│   ├── lib/
│   │   ├── formConfig.ts             # แหล่งความจริงเดียว: FORM_SECTIONS, ALL_FIELDS, ชื่อ Pusher channel
│   │   ├── validation.ts             # ฟังก์ชัน validateForm() แบบ pure (ไม่มี side-effects)
│   │   ├── pusherServer.ts           # Pusher singleton ฝั่ง server (เก็บ APP_SECRET อย่างปลอดภัย)
│   │   └── pusherClient.ts           # Pusher.js singleton ฝั่ง browser (ใช้ public key เท่านั้น)
│   │
│   └── types/
│       └── patient.ts                # TypeScript interfaces: PatientFormData, PatientStatus, FieldConfig ฯลฯ
│
├── tailwind.config.ts                # Custom theme: breakpoint xs, สี brand, keyframe animations
├── tsconfig.json
├── next.config.mjs
├── package.json
├── .gitignore
├── README.md                         # ← ไฟล์นี้
└── DEVELOPMENT_PLAN.md               # เอกสาร design decisions, architecture, และ sync flow
```

---

## วิธีรันโปรเจกต์

### สิ่งที่ต้องมีก่อน

- **Node.js 18+** — [nodejs.org](https://nodejs.org)
- **บัญชี Pusher** (ใช้ฟรีได้) — [pusher.com](https://pusher.com) → สร้าง **Channels** app

### 1 — Clone โปรเจกต์

```bash
git clone https://github.com/your-username/agnos-patient-system.git
cd agnos-patient-system
```

### 2 — ติดตั้ง dependencies

```bash
npm install
```

### 3 — ตั้งค่า environment variables

สร้างไฟล์ `.env.local` ในโฟลเดอร์โปรเจกต์:

```env
# ฝั่ง server เท่านั้น — ไม่ส่งไปให้ browser
PUSHER_APP_ID=your_app_id
PUSHER_SECRET=your_app_secret

# ใช้ได้ทั้ง server และ browser
NEXT_PUBLIC_PUSHER_KEY=your_app_key
NEXT_PUBLIC_PUSHER_CLUSTER=ap1
```

ค่าทั้งสี่หาได้ที่ Pusher Dashboard → **your app → App Keys**

### 4 — เริ่ม development server

```bash
npm run dev
```

| URL | ส่วนงาน |
|-----|--------|
| [localhost:3000/patient](http://localhost:3000/patient) | ฟอร์มลงทะเบียนผู้ป่วย |
| [localhost:3000/staff](http://localhost:3000/staff) | หน้าติดตามข้อมูลเจ้าหน้าที่ |

เปิดทั้งสองในแท็บแยกกันเพื่อทดสอบ real-time sync

---

## การ Deploy

โปรเจกต์ deploy บน **Vercel** ผ่าน GitHub integration — ทุกครั้งที่ push ขึ้น `main` จะ redeploy อัตโนมัติ

### ขั้นตอน

1. Push โปรเจกต์ขึ้น GitHub
2. เข้า [vercel.com/new](https://vercel.com/new) → Import repository
3. Vercel ตรวจพบ Next.js อัตโนมัติ — ไม่ต้องตั้งค่า build เพิ่ม
4. ไปที่ **Settings → Environment Variables** → เพิ่มค่า Pusher ทั้ง 4 ตัว
5. คลิก **Deploy** — ได้ URL แบบ HTTPS ทันที

---

## คำสั่งที่ใช้บ่อย

```bash
npm run dev      # เริ่ม development server พร้อม hot reload
npm run build    # Compile และ optimize สำหรับ production
npm run start    # รัน production build บนเครื่อง
npm run lint     # ตรวจสอบโค้ดด้วย ESLint
```

---

## อ้างอิง Environment Variables

| Variable | ใช้ที่ไหน | คำอธิบาย |
|----------|----------|---------|
| `PUSHER_APP_ID` | Server เท่านั้น | ID ของ Pusher app |
| `PUSHER_SECRET` | Server เท่านั้น | กุญแจลับสำหรับ authenticate กับ Pusher — **ห้ามเปิดเผยให้ browser** |
| `NEXT_PUBLIC_PUSHER_KEY` | Server + Browser | Public key สำหรับ Pusher.js ใน browser ใช้ subscribe channel |
| `NEXT_PUBLIC_PUSHER_CLUSTER` | Server + Browser | Region ของ data centre เช่น `ap1` = สิงคโปร์ |

ตัวแปรที่ขึ้นต้นด้วย `NEXT_PUBLIC_` ถูกส่งไปยัง browser โดยตั้งใจ ส่วนตัวแปรที่ไม่มี prefix นี้ Next.js จะเก็บไว้ใน Node.js runtime เท่านั้น ไม่รั่วออกไปฝั่ง client

---

## License

MIT
