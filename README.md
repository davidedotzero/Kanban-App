# สรุปขั้นตอนการสร้าง Kanban Task Management App (Next.js, Next-Auth, Firebase)

เอกสารนี้สรุปขั้นตอนการพัฒนาและแก้ไขปัญหาที่พบระหว่างการสร้างโปรเจกต์ Kanban App ตามบทช่วยสอน โดยครอบคลุมตั้งแต่การตั้งค่าโปรเจกต์, การติดตั้งระบบยืนยันตัวตน, การตั้งค่า Redux Store, การสร้างหน้าตาแอปพลิเคชัน และการตั้งค่า Firebase

---

## 1. การตั้งค่าโปรเจกต์เริ่มต้น (Initial Project Setup)

- **สร้างโปรเจกต์ Next.js** ด้วยคำสั่ง `npx create-next-app@latest` พร้อมเปิดใช้งาน **TypeScript** และ **Tailwind CSS**
- **ทำความสะอาดโปรเจกต์** โดยลบโค้ดเริ่มต้นใน `app/page.tsx` และ `app/globals.css`

---

## 2. การติดตั้งและตั้งค่า Next-Auth

- **ติดตั้ง Library** ด้วยคำสั่ง `npm install next-auth`
- **สร้างโครงสร้าง API Route** ที่ `app/api/auth/[...nextauth]/` พร้อมไฟล์ `options.ts` และ `route.ts`
- **ตั้งค่า Environment Variables** ในไฟล์ `.env.local` สำหรับ `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXTAUTH_SECRET`, และ `NEXTAUTH_URL`
- **สร้าง Middleware** ในไฟล์ `middleware.ts` เพื่อป้องกัน Route ที่ต้องการการยืนยันตัวตน

---

## 3. การแก้ปัญหา Next-Auth: Configuration 500 Error

- **ปัญหา:** พบข้อผิดพลาด `GET /api/auth/error?error=Configuration 500`
- **การแก้ไข:**
    1.  **แก้ไข `options.ts`**: ตรวจสอบว่า `secret` ใช้ค่าจาก `process.env.NEXTAUTH_SECRET`
    2.  **ตรวจสอบ Google Cloud Console**:
        - **Authorized redirect URIs**: ต้องมีค่า `http://localhost:3000/api/auth/callback/google`
        - **OAuth Consent Screen**: หากสถานะเป็น `Testing` ต้องเพิ่มอีเมลผู้ใช้ทดสอบ

---

## 4. การตั้งค่า Redux Store

- **ติดตั้ง Library** ด้วยคำสั่ง `npm install @reduxjs/toolkit react-redux`
- **สร้างโครงสร้างไฟล์สำหรับ Redux** ภายในโฟลเดอร์ `src/redux/`:
    - `store.ts`: ใช้ `configureStore` เพื่อสร้าง Redux store หลัก
    - `hooks.ts`: สร้าง `useAppDispatch` และ `useAppSelector` ที่เป็น Typed-version
    - `provider.tsx`: สร้าง Custom Provider (`<Providers>`)
- **นำ Provider ไปใช้งาน** โดยการครอบ `children` ในไฟล์ `app/layout.tsx`
- **แก้ปัญหา Redux Initialization** โดยการสร้าง `placeholderSlice.ts` ชั่วคราวเพื่อให้ `configureStore` มี reducer อย่างน้อยหนึ่งตัว

---

## 5. การแก้ปัญหา TypeScript: Cannot find module

- **ปัญหา:** พบข้อผิดพลาด `Cannot find module '@/...'`
- **สาเหตุ:** TypeScript ไม่รู้จัก "Path Alias" `@/`
- **การแก้ไข:**
    - **อัปเดตไฟล์ `tsconfig.json`** โดยเพิ่มการตั้งค่า `baseUrl` และ `paths` ภายใน `compilerOptions`

      ```json
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"]
        }
      }
      ```

---

## 6. การสร้างหน้าตาแอปพลิเคชัน (UI Markup)

- **สร้างโฟลเดอร์ `components`** ภายใน `src/app/`
- **สร้าง `Navbar.tsx`**: สร้างแถบนำทางด้านบนและนำไปใส่ใน `layout.tsx`
- **สร้าง `Dropdown.tsx`**: สร้างเมนู Dropdown และนำไปใส่ใน `Navbar` โดยใช้ `useState`
- **สร้าง `Sidebar.tsx`**: สร้างแถบเมนูด้านข้าง
- **สร้าง `BoardTasks.tsx`**: สร้างพื้นที่สำหรับแสดงคอลัมน์และ Task
- **นำ `Sidebar` และ `BoardTasks`** ไปแสดงผลใน `page.tsx`
- **ปรับแก้ `layout.tsx`**: เพิ่ม `className` ให้กับแท็ก `<body>` เพื่อจัดการการแสดงผลและการ scroll

---

## 7. การตั้งค่า Firebase Firestore

- **สร้างโปรเจกต์** บน [Firebase console](https://console.firebase.google.com/)
- **ติดตั้ง Library** ด้วยคำสั่ง `npm install firebase`
- **สร้างไฟล์ Configuration** ที่ `utils/firebaseConfig.ts` และนำ Firebase config ที่ได้จากเว็บมาใส่
- **Initialize Firebase และ Firestore** ในไฟล์ `firebaseConfig.ts` และ export `db` instance
- **สร้างฐานข้อมูล Cloud Firestore** บน Console
- **แก้ไขกฎ (Rules)** ของ Firestore เป็น `allow read, write: if true;` เพื่อความสะดวกในการพัฒนาระยะแรก **(ไม่ปลอดภัยสำหรับ Production)**

**สถานะปัจจุบัน:** แอปพลิเคชันได้เชื่อมต่อกับ Firebase เรียบร้อยแล้ว พร้อมสำหรับขั้นตอนถัดไป คือการสร้างและจัดการข้อมูลในฐานข้อมูล