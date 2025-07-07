# สรุปขั้นตอนการสร้าง Kanban Task Management App (Next.js, Next-Auth, Firebase)

เอกสารนี้สรุปขั้นตอนการพัฒนาและแก้ไขปัญหาที่พบระหว่างการสร้างโปรเจกต์ Kanban App ตามบทช่วยสอน โดยครอบคลุมตั้งแต่การตั้งค่าโปรเจกต์, การติดตั้งระบบยืนยันตัวตน, การตั้งค่า Redux Store, การสร้างหน้าตาแอปพลิเคชัน และการจัดการข้อมูลเบื้องต้นกับ Firebase

---

## 1. การตั้งค่าโปรเจกต์เริ่มต้น (Initial Project Setup)

- **สร้างโปรเจกต์ Next.js** ด้วยคำสั่ง `npx create-next-app@latest` พร้อมเปิดใช้งาน **TypeScript** และ **Tailwind CSS**
- **ทำความสะอาดโปรเจกต์** โดยลบโค้ดเริ่มต้นใน `app/page.tsx` และ `app/globals.css`

---

## 2. การติดตั้งและตั้งค่า Next-Auth

- **ติดตั้ง Library** ด้วยคำสั่ง `npm install next-auth`
- **สร้างโครงสร้าง API Route** ที่ `app/api/auth/[...nextauth]/` พร้อมไฟล์ `options.ts` และ `route.ts`
- **ตั้งค่า Environment Variables** ในไฟล์ `.env.local`
- **สร้าง Middleware** ในไฟล์ `middleware.ts` เพื่อป้องกัน Route

---

## 3. การแก้ปัญหา Next-Auth: Configuration 500 Error

- **ปัญหา:** พบข้อผิดพลาด `GET /api/auth/error?error=Configuration 500`
- **การแก้ไข:** ตรวจสอบ `options.ts` และการตั้งค่าใน **Google Cloud Console** (Authorized redirect URIs, OAuth Consent Screen)

---

## 4. การตั้งค่า Redux Store

- **ติดตั้ง Library** ด้วยคำสั่ง `npm install @reduxjs/toolkit react-redux`
- **สร้างโครงสร้างไฟล์สำหรับ Redux** ภายในโฟลเดอร์ `src/redux/` (`store.ts`, `hooks.ts`, `provider.tsx`)
- **นำ Provider ไปใช้งาน** โดยการครอบ `children` ในไฟล์ `app/layout.tsx`
- **แก้ปัญหา Redux Initialization** โดยการสร้าง `placeholderSlice.ts` ชั่วคราว

---

## 5. การแก้ปัญหา TypeScript: Cannot find module

- **ปัญหา:** พบข้อผิดพลาด `Cannot find module '@/...'`
- **สาเหตุ:** TypeScript ไม่รู้จัก "Path Alias" `@/`
- **การแก้ไข:** อัปเดตไฟล์ `tsconfig.json` โดยเพิ่มการตั้งค่า `baseUrl` และ `paths`

---

## 6. การสร้างหน้าตาแอปพลิเคชัน (UI Markup)

- **สร้างโฟลเดอร์ `components`** และสร้าง UI components ทั้งหมด (`Navbar.tsx`, `Dropdown.tsx`, `Sidebar.tsx`, `BoardTasks.tsx`)
- **ประกอบ Components** เข้าด้วยกันใน `layout.tsx` และ `page.tsx`
- **ปรับแก้ `layout.tsx`**: เพิ่ม `className` ให้กับแท็ก `<body>` เพื่อจัดการการแสดงผลและการ scroll

---

## 7. การตั้งค่า Firebase Firestore

- **สร้างโปรเจกต์** บน [Firebase console](https://console.firebase.google.com/)
- **ติดตั้ง Library** ด้วยคำสั่ง `npm install firebase`
- **สร้างไฟล์ Configuration** ที่ `utils/firebaseConfig.ts`
- **แก้ไขกฎ (Rules)** ของ Firestore เป็น `allow read, write: if true;` สำหรับการพัฒนา

---

## 8. การเพิ่มข้อมูลเริ่มต้นให้ผู้ใช้ใหม่

- **สร้างไฟล์ `data.js`** ที่ `utils/` เพื่อเก็บข้อมูลจำลอง (Dummy Data)
- **แก้ไข `page.tsx`**:
  - ใช้ `getSession` เพื่อดึงข้อมูลผู้ใช้ที่ล็อกอิน
  - ใช้ `useEffect` เพื่อตรวจสอบว่าผู้ใช้มีข้อมูลใน Firestore แล้วหรือยัง
  - หากเป็นผู้ใช้ใหม่ ให้ใช้ `addDoc` เพื่อสร้าง document เริ่มต้นให้ใน Firestore ภายใต้ path `users/{userEmail}/tasks`

---

## 9. การแก้ปัญหา (ช่วงเชื่อมต่อข้อมูล)

- **ปัญหา TypeScript:** พบ Error เกี่ยวกับ `void`, `never`, และการใช้ `getDocs`
- **การแก้ไข:**
  1.  **เปลี่ยนชื่อตัวแปร:** แก้ไขการตั้งชื่อตัวแปรที่ซ้ำกับฟังก์ชัน `getDocs` ที่ import มา
  2.  **เพิ่ม Type Safety:** Import `Session` type จาก `next-auth` มาใช้กำหนดประเภทของ State ให้ชัดเจนขึ้น เพื่อแก้ปัญหาการอนุมาน Type ที่ผิดพลาด
- **ปัญหา Firebase:** พบ Error `FirebaseError: "projectId" not provided`
- **การแก้ไข:**
  - **เติม `firebaseConfig`:** คัดลอกค่า Config ทั้งหมดจาก Firebase Console มาวางในอ็อบเจกต์ `firebaseConfig` ในไฟล์ `utils/firebaseConfig.ts`

**สถานะปัจจุบัน:** แอปพลิเคชันสามารถสร้างข้อมูลเริ่มต้นสำหรับผู้ใช้ใหม่ใน Firestore ได้อย่างถูกต้อง พร้อมสำหรับขั้นตอนถัดไป คือการดึงข้อมูลจาก Firestore มาใช้งานด้วย RTK Query