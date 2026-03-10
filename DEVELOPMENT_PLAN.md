# เอกสารแผนการพัฒนา (Development Planning Document)

**โปรเจกต์:** Agnos Patient System
**ตำแหน่ง:** Frontend Developer Candidate Assignment
**Tech Stack:** Next.js 14 · TypeScript · TailwindCSS · Pusher Channels

---

## สารบัญ

1. [โครงสร้างโปรเจกต์](#1-โครงสร้างโปรเจกต์)
2. [การตัดสินใจด้าน UI/UX](#2-การตัดสินใจดาน-uiux)
3. [สถาปัตยกรรม Component](#3-สถาปัตยกรรม-component)
4. [กระบวนการ Real-Time Synchronization](#4-กระบวนการ-real-time-synchronization)
5. [กลยุทธ์การ Validate ข้อมูล](#5-กลยุทธ์การ-validate-ข้อมูล)
6. [กลยุทธ์ Responsive Design](#6-กลยุทธ์-responsive-design)

---

## 1. โครงสร้างโปรเจกต์

### ภาพรวมโครงสร้างโฟลเดอร์

```
src/
├── app/          → หน้าเพจและ API routes (Next.js App Router)
├── components/   → UI ทั้งหมด แบ่งเป็น ui/, patient/, staff/
├── hooks/        → Custom React hooks — logic ทั้งหมดอยู่ที่นี่
├── lib/          → Utility, config, และ third-party singletons
└── types/        → TypeScript interfaces ที่ใช้ร่วมกัน
```

### หลักการออกแบบ: Separation of Concerns

ทุกไฟล์ในโปรเจกต์นี้มี **หน้าที่ที่ชัดเจนเพียงอย่างเดียว** ซึ่งเป็นหลักการที่ใช้ตัดสินใจทุกโครงสร้าง:

**`components/`** มีหน้าที่แสดงผลอย่างเดียว รับข้อมูลผ่าน props แล้ว render JSX ไม่มี `fetch`, ไม่มี timer, ไม่มี business logic ทำให้อ่านและทบทวนได้ง่าย

**`hooks/`** รับผิดชอบ side-effects ทั้งหมด ไม่ว่าจะเป็น API call, WebSocket subscription, หรือ timer ล้วนอยู่ใน custom hook component เรียกใช้ hook แล้ว hook ไปจัดการกับโลกภายนอก

**`lib/`** เก็บ configuration และ utility ที่ไม่ผูกกับ component ใดเป็นพิเศษ ไฟล์สำคัญที่สุดคือ `formConfig.ts` ซึ่งเป็น **แหล่งความจริงเดียว** สำหรับ field definitions ทั้งหมด ทั้ง Patient Form และ Staff View import จากไฟล์นี้ ทำให้ label, ลำดับ และ metadata ของ field ตรงกันเสมอ

**`types/`** กำหนดรูปแบบของข้อมูลที่แชร์ระหว่าง component การกำหนด interface `PatientFormData` และ `PatientStatus` ไว้ที่เดียวทำให้ TypeScript ตรวจจับความไม่ตรงกันได้ตั้งแต่ compile time ก่อนที่จะกลายเป็น bug จริง

### อ้างอิงแต่ละไฟล์

| ไฟล์ | หน้าที่ |
|------|--------|
| `app/layout.tsx` | Root layout: โหลด Google Fonts, render `<Navbar>`, เพิ่ม background mesh, ตั้ง viewport meta สำหรับมือถือ |
| `app/page.tsx` | Redirect root `/` ไปที่ `/patient` |
| `app/patient/page.tsx` | Route `/patient` — render หัวหน้าเพจและ `<PatientForm>` |
| `app/staff/page.tsx` | Route `/staff` — render หัวหน้าเพจและ `<StaffView>` |
| `app/api/sync/route.ts` | `POST /api/sync` — API endpoint เดียวของระบบ รับข้อมูลจาก browser ผู้ป่วยแล้ว trigger Pusher event |
| `components/ui/Navbar.tsx` | Navigation bar แบบ sticky มี tab switcher ที่ปรับตามขนาดหน้าจอ และ live indicator |
| `components/ui/FormField.tsx` | Render หนึ่งช่อง: label + input/select/textarea + error message |
| `components/ui/StatusBadge.tsx` | แสดงสถานะผู้ป่วยพร้อม animated dot และ SVG circular progress ring |
| `components/patient/PatientForm.tsx` | วนลูป `FORM_SECTIONS` render `<FormField>` แต่ละช่อง มอบ logic ทั้งหมดให้ `usePatientForm` |
| `components/patient/SuccessScreen.tsx` | หน้ายืนยันแบบ full-page หลัง submit สำเร็จ |
| `components/staff/StaffView.tsx` | Dashboard หลัก ใช้ `useRealtimeSync` และ render `<StatusBadge>` กับ `<StaffFieldGrid>` |
| `components/staff/StaffFieldGrid.tsx` | Render การ์ดข้อมูลแต่ละ section พร้อม highlight animation เมื่อค่าเปลี่ยน |
| `hooks/usePatientForm.ts` | จัดการ form state, validation, inactivity timer, และ broadcast ไปยัง `/api/sync` |
| `hooks/useRealtimeSync.ts` | Subscribe Pusher channel, รับ event, ติดตามว่า key ไหนเพิ่งเปลี่ยนเพื่อ animation |
| `lib/formConfig.ts` | กำหนด `FORM_SECTIONS`, `ALL_FIELDS`, `REQUIRED_FIELD_KEYS`, และชื่อ Pusher channel/event |
| `lib/validation.ts` | Pure function `validateForm()` คืน `Record<fieldKey, errorMessage>` ไม่มี side-effects |
| `lib/pusherServer.ts` | Pusher singleton ฝั่ง server เก็บ `PUSHER_SECRET` อย่างปลอดภัย |
| `lib/pusherClient.ts` | Pusher.js singleton ฝั่ง browser ใช้เฉพาะ public key |
| `types/patient.ts` | `PatientFormData`, `PatientStatus`, `SyncPayload`, `FieldConfig`, `FormSection` interfaces |

---

## 2. การตัดสินใจด้าน UI/UX

### ทิศทาง Visual Design

Interface ใช้ **dark clinical aesthetic** — พื้นหลังสีน้ำเงินเข้ม (`#080c14`) กับ teal accent (`#38bd8c`) ซึ่งเลือกอย่างมีเหตุผล:

- พื้นหลังมืดช่วยลดความเมื่อยล้าของสายตาสำหรับเจ้าหน้าที่ที่จ้องจอเป็นเวลานาน
- สี teal เป็นสีที่เกี่ยวข้องกับการแพทย์อย่างกว้างขวาง ให้ความรู้สึกสงบและเป็นมืออาชีพ
- ความคมชัดระหว่างพื้นหลังมืดกับ teal accent ทำให้ element ที่ interactive เห็นได้ชัดโดยไม่รู้สึกแข็งกร้าว

Background mesh gradient แบบ radial เพิ่มความลึกให้หน้าตาโดยไม่ดึงสายตาออกจากฟอร์ม

### Typography

ใช้ typeface คู่สองชนิดเพื่อสร้าง visual hierarchy ที่ชัดเจน:

- **DM Serif Display** — ใช้กับ heading และ label สำคัญ ลักษณะ editorial ให้ความรู้สึกน่าเชื่อถือ
- **DM Sans** — ใช้กับ body text, form label, และ input โครงสร้าง geometric อ่านง่ายมากในขนาดเล็ก

การจับคู่นี้หลีกเลี่ยง system font ทั่วไป (Arial, Inter, Roboto) ที่จะทำให้ interface ดูสำเร็จรูปแทนที่จะถูกออกแบบมาเพื่อวัตถุประสงค์นี้โดยเฉพาะ

### การแยกเป็นสอง URL

Patient Form อยู่ที่ `/patient` และ Staff View อยู่ที่ `/staff` เป็นการตัดสินใจเชิง architecture โดยตั้งใจ ไม่ใช่แค่ความสะดวก เพราะ:

- เจ้าหน้าที่ bookmarks หน้า Staff View ได้โดยไม่เห็น Patient Form
- ผู้ป่วยไม่สามารถเข้าถึงหน้า Staff View โดยบังเอิญ
- แต่ละหน้ามี `<title>` และ metadata เป็นของตัวเอง ชัดเจนใน browser history
- Code แยกออกจากกันสะอาด แต่ละหน้ามีผู้ใช้งานที่ชัดเจนหนึ่งกลุ่ม

### Micro-Interactions และ Feedback

ทุก interaction มี visual response ที่สอดคล้อง:

| การกระทำ | การตอบสนองของ UI |
|---------|-----------------|
| Focus input | กรอบสี teal พร้อม `box-shadow` glow |
| Input มี error | กรอบแดง + error message slide เข้าจากซ้าย |
| โหลดหน้าฟอร์ม | animation `fadeUp` แบบ staggered ทีละช่อง |
| Staff field ได้รับข้อมูลใหม่ | pulse ring สีเขียวนาน 0.9 วินาที |
| SVG progress ring | arc animation เมื่อกรอกข้อมูลครบขึ้น |
| Hover submit button | ยกขึ้น 1px พร้อม drop shadow เพิ่ม |
| สถานะเปลี่ยน | background crossfade ข้ามเวลา 0.4 วินาที |

micro-interaction เหล่านี้มีจุดประสงค์เชิงหน้าที่จริง: ช่วยให้ผู้ใช้รับรู้ว่า action ของตนถูกรับ และดึงความสนใจไปยังข้อมูลที่เปลี่ยนแปลง ซึ่งสำคัญมากสำหรับ Staff View ที่มีข้อมูลหนาแน่น

### Inactivity Detection

Staff View ต้องสื่อสารไม่เพียงแค่ว่าผู้ป่วยพิมพ์อะไร แต่ยังต้องบอกว่าผู้ป่วยยังอยู่หน้าจอหรือไม่ จึงมีการตั้ง inactivity timer 6 วินาทีใน `usePatientForm`:

- ทุก keystroke จะ reset timer
- หากผ่านไป 6 วินาทีโดยไม่มีการพิมพ์ จะ broadcast `filling → inactive`
- เมื่อ submit แล้ว timer จะถูกยกเลิกถาวร

ช่วยให้เจ้าหน้าที่ตีความได้ว่า สถานะ `Inactive` หลังจาก `Filling In` หมายถึงผู้ป่วยอาจออกไปหรือทิ้งฟอร์ม ซึ่งอาจต้องการให้เจ้าหน้าที่เข้าไปช่วยเหลือ

---

## 3. สถาปัตยกรรม Component

### Component Tree

```
RootLayout
└── Navbar                        shared · sticky · navigation เท่านั้น
    │
    ├── /patient → PatientPage
    │   └── PatientForm            orchestrator · ใช้ usePatientForm()
    │       ├── [วนลูป section]
    │       │   └── FormField      pure · label + input + error
    │       └── SuccessScreen      pure · ยืนยัน post-submit
    │
    └── /staff → StaffPage
        └── StaffView              orchestrator · ใช้ useRealtimeSync()
            ├── StatusBadge        pure · status dot + SVG ring
            ├── progress bar       inline · animated width
            └── [วนลูป section]
                └── StaffFieldGrid pure · field cards + highlight
```

### Pattern: Container / Presentational

ทุก component แบ่งเป็นสองแบบชัดเจน คือ **orchestrator** หรือ **pure display** ไม่มีตรงกลาง

**Orchestrators** (`PatientForm`, `StaffView`) เรียก hook เพื่อรับ state และ callback จากนั้นกระจายข้อมูลลงไปผ่าน props มีแค่ iteration และ conditional rendering ใน JSX

**Pure display components** (`FormField`, `StatusBadge`, `StaffFieldGrid`, `SuccessScreen`) รับข้อมูลทั้งหมดผ่าน props ไม่มี internal state, ไม่มี `useEffect`, ไม่รู้ว่าข้อมูลมาจากไหน ผู้ที่ review โค้ดสามารถเข้าใจ output ได้จาก props เพียงอย่างเดียว

ข้อดีของ pattern นี้:
- โค้ดอ่านจากบนลงล่างได้อย่างเป็นเส้นตรง
- แต่ละ component ทบทวนได้โดยไม่ต้องดู component อื่น
- การเปลี่ยนแปลงในอนาคต (เช่น เปลี่ยนจาก Pusher เป็น Socket.io) ต้องแก้แค่ hook ไม่ต้องแตะ component

### Custom Hooks

| Hook | ใช้งานโดย | หน้าที่ |
|------|----------|--------|
| `usePatientForm` | `PatientForm` | จัดการ state ของ `form`, `errors`, `touched`, `submitted` / รัน validation ตาม blur และ submit / ควบคุม inactivity `setTimeout` / เรียก `broadcastUpdate()` ทุกครั้งที่มีการเปลี่ยนแปลง |
| `useRealtimeSync` | `StaffView` | Subscribe Pusher channel `patient-form` ตอน mount / รับ `SyncPayload` event / diff ข้อมูลเก่าและใหม่เพื่อหา `updatedKeys` / ล้าง `updatedKeys` หลัง 900ms / Unsubscribe ตอน unmount |

### สรุปหน้าที่ Component

| Component | มี State? | มี Side-Effect? | หมายเหตุ |
|-----------|----------|-----------------|---------|
| `Navbar` | ไม่มี (อ่าน URL จาก `usePathname`) | ไม่มี | Active tab มาจาก current route |
| `FormField` | ไม่มี | ไม่มี | พฤติกรรมทั้งหมดขึ้นกับ `onChange` และ `onBlur` callback |
| `StatusBadge` | ไม่มี | ไม่มี | SVG ring คำนวณจาก `filledCount / totalCount` |
| `PatientForm` | ผ่าน hook | ผ่าน hook | มอบให้ `usePatientForm` ทั้งหมด |
| `SuccessScreen` | ไม่มี | ไม่มี | Render ตาม `submitted` prop |
| `StaffView` | ผ่าน hook | ผ่าน hook | มอบให้ `useRealtimeSync` ทั้งหมด |
| `StaffFieldGrid` | ไม่มี | ไม่มี | `updatedKeys` Set ควบคุม CSS animation class |

---

## 4. กระบวนการ Real-Time Synchronization

### ภาพรวม

การอัปเดต real-time ไหลทิศทางเดียว: จาก browser ผู้ป่วย → ผ่าน Next.js server → ผ่าน Pusher WebSocket infrastructure → ไปยัง browser เจ้าหน้าที่ที่เชื่อมต่ออยู่ทั้งหมด server ทำหน้าที่เป็น relay ที่ปลอดภัย ไม่เก็บข้อมูล เพียงแค่ส่งต่อ

### ขั้นตอนทีละขั้น

```
┌──────────────────────┐      ┌───────────────────────┐      ┌──────────────────────┐
│   Browser ผู้ป่วย    │      │   Next.js Server       │      │   Browser เจ้าหน้าที่│
│   /patient           │      │   (Vercel Serverless)  │      │   /staff             │
└──────────────────────┘      └───────────────────────┘      └──────────────────────┘
          │                               │                               │
          │  ผู้ป่วยพิมพ์ในช่องฟอร์ม     │                               │
          │                               │                               │
          │  usePatientForm.handleChange()│                               │
          │  → setForm() [local state]    │                               │
          │  → resetInactiveTimer()       │                               │
          │                               │                               │
          │  POST /api/sync               │                               │
          │  { data: {...},               │                               │
          │    status: "filling" }        │                               │
          │ ─────────────────────────────►│                               │
          │                               │                               │
          │                               │  pusherServer.trigger(        │
          │                               │    "patient-form",            │
          │                               │    "form-update",             │
          │                               │    { data, status }           │
          │                               │  )                            │
          │                               │ ──── WebSocket push ─────────►│
          │                               │      (Pusher infrastructure)  │
          │                               │                               │
          │                               │                               │  useRealtimeSync
          │                               │                               │  channel.bind("form-update")
          │                               │                               │  → เปรียบเทียบ prev vs new
          │                               │                               │  → setData() + setStatus()
          │                               │                               │  → setUpdatedKeys()
          │                               │                               │
          │                               │                               │  StaffView re-renders:
          │                               │                               │  • StatusBadge อัปเดต
          │                               │                               │  • ช่องที่เปลี่ยน highlight
          │                               │                               │  • Progress ring animate
```

### ทำไมต้อง Trigger ฝั่ง Server?

`APP_SECRET` ของ Pusher ที่ใช้ authenticate การส่ง event ต้องไม่ถูกเปิดเผยใน browser หากหน้า patient เรียก Pusher โดยตรง ใครก็ตามสามารถเปิด DevTools ดึง secret ออกมา แล้วส่ง event ปลอมไปยัง Staff View ได้

การ route broadcast ทั้งหมดผ่าน `/api/sync` ทำให้ secret อยู่ใน Node.js environment เสมอ browser มีแค่ `NEXT_PUBLIC_PUSHER_KEY` ซึ่งใช้ได้เพียงแค่ *รับ* event เท่านั้น ไม่สามารถปลอมตัวเป็น publisher ได้

### ทำไมใช้ Pusher แทน Native WebSocket?

WebSocket server ต้องการ **connection แบบ persistent** ซึ่งไม่รองรับบน serverless platform อย่าง Vercel ที่แต่ละ request สร้าง function instance ใหม่ Pusher แก้ปัญหานี้โดยทำหน้าที่เป็น WebSocket server ที่ persistent ให้ Next.js app ของเราคงสถานะ stateless และ serverless อย่างสมบูรณ์

### รายละเอียด Inactivity Detection

```
ผู้ป่วยพิมพ์ keystroke
  └─► resetInactiveTimer(updatedForm)
        └─► clearTimeout(timer เดิม)
        └─► setTimeout(() => broadcast(data, "inactive"), 6000)

[ถ้าผ่านไป 6 วินาทีโดยไม่มี keystroke ใหม่]
  └─► broadcast({ data: currentForm, status: "inactive" })
      └─► Staff View เปลี่ยน status badge เป็น "Waiting"

[ถ้าผู้ป่วย submit ฟอร์ม]
  └─► clearTimeout(timer) — ยกเลิก timer ถาวร
  └─► broadcast({ data: finalForm, status: "submitted" })
```

### การติดตาม Updated Fields

เมื่อ Staff View ได้รับ payload ใหม่ `useRealtimeSync` จะ diff ข้อมูลเก่ากับใหม่เพื่อหาว่า key ไหนเปลี่ยน:

```ts
const updatedKeys = new Set(
  Object.keys(payload.data).filter(k => payload.data[k] !== prev.data[k])
);
```

Set นี้ถูกส่งไปยัง `StaffFieldGrid` ซึ่งจะใส่ CSS class `pulse-ring` animation ให้การ์ดที่ key อยู่ใน Set หลัง 900ms จะล้าง `updatedKeys` โดยอัตโนมัติ ทำให้ animation รีเซ็ตตัวเองโดยไม่ต้องจัดการ state เพิ่มเติม

### ชื่อ Channel และ Event

ชื่อ Pusher channel และ event ถูกกำหนดเป็น constant ใน `lib/formConfig.ts`:

```ts
export const PUSHER_CHANNEL = "patient-form";
export const PUSHER_EVENT   = "form-update";
```

การรวมไว้ที่เดียวป้องกัน typo ที่จะทำให้ฝั่ง publish trigger event ชื่อหนึ่ง แต่ฝั่ง subscribe ฟัง event อีกชื่อ ซึ่งจะ fail แบบเงียบๆ หาสาเหตุยากมาก

---

## 5. กลยุทธ์การ Validate ข้อมูล

### Progressive Validation

Error จะแสดงแบบ **progressive** — ปรากฏหลังจากผู้ใช้ interact กับช่องนั้นแล้ว (ตอน `blur`) ไม่ใช่ตั้งแต่โหลดหน้า วิธีนี้หลีกเลี่ยงประสบการณ์แย่ๆ ที่ผู้ใช้เปิดหน้ามาแล้วเห็นทุกช่องแจ้ง error ทันที

```
โหลดหน้าครั้งแรก      → ไม่มี error (touched = {})
Focus ช่อง             → ยังไม่เปลี่ยนอะไร
Blur จากช่อง           → ช่องถูก mark ว่า touched / รัน validateForm() / แสดง error ถ้าไม่ผ่าน
พิมพ์ในช่องที่ touched → รัน validateForm() ใหม่ทันที (real-time feedback)
กด Submit              → mark ทุกช่องว่า touched / รัน validateForm() / แสดง error ทั้งหมด
```

### Pure Validation Function

`validateForm()` ใน `lib/validation.ts` เป็น pure function ที่ไม่มี side-effects:

```ts
function validateForm(form: Partial<PatientFormData>): ValidationErrors
```

รับข้อมูลฟอร์มและคืน `Record<fieldKey, errorMessage>` ถ้าคืน object ว่างหมายความว่าฟอร์มผ่านทุก validation การออกแบบนี้ทำให้:
- Test ได้โดยไม่ต้อง mock React state
- ใช้ซ้ำได้ทั้งจาก `handleBlur` และ `handleSubmit`
- Predictable — input เดิมให้ output เดิมเสมอ

### กฎ Validation

| ช่อง | กฎ |
|-----|-----|
| ชื่อ | บังคับ — ต้องไม่ว่าง |
| นามสกุล | บังคับ — ต้องไม่ว่าง |
| วันเกิด | บังคับ |
| เพศ | บังคับ — ต้องเลือกตัวเลือก |
| เบอร์โทรศัพท์ | บังคับ + รูปแบบ: 7–15 ตัวอักษร ประกอบด้วยตัวเลข, `+`, `-`, ช่องว่าง, วงเล็บ |
| อีเมล | บังคับ + รูปแบบ: `[name]@[domain].[tld]` |
| ที่อยู่ | บังคับ |
| ภาษาที่ต้องการ | บังคับ |
| สัญชาติ | บังคับ |
| ชื่อกลาง | ไม่บังคับ |
| ผู้ติดต่อฉุกเฉิน | ไม่บังคับ |
| ศาสนา | ไม่บังคับ |

---

## 6. กลยุทธ์ Responsive Design

### Breakpoints ที่ใช้

เพิ่ม breakpoint `xs` (`375px`) ใน Tailwind config เพื่อรองรับโทรศัพท์ขนาดเล็ก (iPhone SE, Android รุ่นเก่า) ที่ต่ำกว่า `sm: 640px` ของ Tailwind:

| Breakpoint | ความกว้าง | เป้าหมาย |
|-----------|----------|---------|
| `xs` | 375px | โทรศัพท์ขนาดเล็ก (iPhone SE, Galaxy A series) |
| `sm` | 640px | โทรศัพท์ขนาดใหญ่ / landscape |
| `md` | 768px | Tablet |
| `lg` | 1024px | Laptop |

### พฤติกรรม Layout แต่ละ Breakpoint

**Navbar:**
- มือถือ (`< sm`): ปุ่ม tab แสดงแค่ icon / ซ่อน "Live Sync" text / ซ่อนชื่อ brand ถ้า `< xs`
- Tablet (`sm`): icon + ชื่อสั้น ("Patient", "Staff") / "Live Sync" มองเห็น
- Desktop (`md+`): ชื่อเต็ม ("Patient Form", "Staff View")

**Patient Form Grid:**
- มือถือ (`< sm`): ทุกช่องเต็มความกว้าง คอลัมน์เดียว
- Tablet+ (`sm+`): ช่องที่มี `half: true` render เป็น 2 คอลัมน์ (เช่น ชื่อ / นามสกุล เคียงกัน)
- ช่องเต็มความกว้าง (ที่อยู่, อีเมล, เบอร์โทร) ยังคง span ทั้งสอง column ทุก breakpoint

**Action Buttons:**
- มือถือ: stack แนวตั้งเต็มความกว้าง "Clear Form" อยู่ล่าง (`flex-col-reverse`)
- Tablet+: เรียงแนวนอน ความกว้างอัตโนมัติ ชิดขวา (`flex-row justify-end`)

**Staff Field Grid:** ใช้ logic คอลัมน์เดียวกับ Patient Form เพื่อความสม่ำเสมอ

**StatusBadge:**
- มือถือ: status label และ progress ring stack แนวตั้ง (`flex-col`)
- Tablet+: เรียงแนวนอน (`flex-row justify-between`)

### รายละเอียดเฉพาะสำหรับมือถือ

**Touch Targets:** element ที่ interactive ทั้งหมด (input, button, select) มีความสูงขั้นต่ำ `44px` ตามที่ Apple Human Interface Guidelines แนะนำสำหรับการแตะที่สะดวก

**ป้องกัน iOS Zoom:** Mobile Safari จะ zoom เข้าหา input ที่มี font-size เล็กกว่า 16px โดยอัตโนมัติ เพื่อป้องกันจึงใช้ `font-size: max(16px, 0.875rem)` บนมือถือ แล้วกลับเป็น `0.875rem` ที่ `sm+` ผ่าน media query นอกจากนี้ยังตั้ง `maximum-scale: 1` ใน viewport meta เป็นการป้องกันซ้ำอีกชั้น

**ลบ Tap Highlight:** ตั้งค่า `-webkit-tap-highlight-color: transparent` ทั่วทั้งหน้า เพื่อลบกล่องสีเทาที่กระพริบเมื่อแตะบน Android Chrome ซึ่งทำให้ interface ดูไม่ขัดเกลา

**Safe Area Insets:** Tailwind config มี `safe: "env(safe-area-inset-bottom)"` เป็น spacing utility สำหรับอุปกรณ์ที่มี home indicator (iPhone X ขึ้นไป) เพื่อป้องกัน content ถูกบังที่ขอบล่างของหน้าจอ
