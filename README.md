# สรุปขั้นตอนการสร้าง Kanban Task Management App (Next.js, Next-Auth, Firebase)

เอกสารนี้สรุปขั้นตอนการพัฒนาและแก้ไขปัญหาที่พบระหว่างการสร้างโปรเจกต์ Kanban App ตามบทช่วยสอน โดยเน้นที่การตั้งค่าโปรเจกต์เริ่มต้นและการติดตั้งระบบยืนยันตัวตนด้วย `next-auth.js`

## 1. การตั้งค่าโปรเจกต์เริ่มต้น (Initial Project Setup)

### 1.1. สร้างโปรเจกต์ Next.js
ใช้คำสั่ง `create-next-app` เพื่อสร้างโปรเจกต์ใหม่ พร้อมเปิดใช้งาน TypeScript และ Tailwind CSS

```bash
npx create-next-app@latest kanban-app-tutorial
```

### 1.2. ทำความสะอาดโปรเจกต์
- **ลบเนื้อหาในไฟล์ `app/page.tsx`** และใส่โค้ดชั่วคราว:
  ```tsx
  export default function Home() {
    return (
      <main>
        <p>Hi</p>
      </main>
    )
  }
  ```
- **แก้ไขไฟล์ `app/globals.css`** โดยเหลือไว้เฉพาะส่วนที่ import Tailwind CSS เท่านั้น

## 2. การติดตั้งและตั้งค่า Next-Auth

### 2.1. ติดตั้ง Library
```bash
npm install next-auth
```

### 2.2. สร้างโครงสร้างไฟล์สำหรับ API Route
สร้างไฟล์และโฟลเดอร์ตามโครงสร้างต่อไปนี้:
```
app/
└── api/
    └── auth/
        └── [...nextauth]/
            ├── options.ts
            └── route.ts
```

### 2.3. ตั้งค่า `options.ts`
ไฟล์นี้ใช้สำหรับกำหนดค่า provider ที่จะใช้ (ในที่นี้คือ Google)

```typescript
// app/api/auth/[...nextauth]/options.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const options: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
};
```

### 2.4. ตั้งค่า `route.ts`
ไฟล์นี้ทำหน้าที่รับ request `GET` และ `POST` ที่เข้ามายัง API route ของ `next-auth`

```typescript
// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth/next";
import { options } from "./options";

const handler = NextAuth(options);

export { handler as GET, handler as POST };
```

### 2.5. ตั้งค่า Environment Variables (`.env.local`)
สร้างไฟล์ `.env.local` ที่ **root** ของโปรเจกต์เพื่อเก็บค่า credentials และ secret key
- `GOOGLE_CLIENT_ID` และ `GOOGLE_CLIENT_SECRET` สามารถขอได้จาก [Google Cloud Console](https://console.cloud.google.com/)
- `NEXTAUTH_SECRET` สร้างได้ด้วยคำสั่ง:
  ```bash
  openssl rand -base64 32
  ```
- `NEXTAUTH_URL` สำหรับการพัฒนาคือ `http://localhost:3000`

**ตัวอย่างไฟล์ `.env.local`:**
```env
GOOGLE_CLIENT_ID=<your-client-id>
GOOGLE_CLIENT_SECRET=<your-client-secret>
NEXTAUTH_SECRET=<your-generated-secret>
NEXTAUTH_URL=http://localhost:3000
```

### 2.6. สร้าง Middleware เพื่อป้องกัน Route
สร้างไฟล์ `middleware.ts` ที่ **root** ของโปรเจกต์ เพื่อบังคับให้ผู้ใช้ต้องล็อกอินก่อนเข้าถึงหน้าแรก (`/`)

```typescript
// middleware.ts
export { default } from 'next-auth/middleware'

export const config = { matcher: ['/'] }
```

---

## 3. การแก้ปัญหา `Configuration 500 Error`

หลังจากตั้งค่าเสร็จสิ้น พบข้อผิดพลาด `GET /api/auth/error?error=Configuration 500` ซึ่งบ่งชี้ว่าการตั้งค่า `next-auth` มีปัญหา ได้ดำเนินการแก้ไขตามขั้นตอนดังนี้:

### 3.1. ตรวจสอบและแก้ไขโค้ด
- **แก้ไข `options.ts`:** property `secret` ต้องใช้ `process.env.NEXTAUTH_SECRET` ไม่ใช่ `NEXTAUTH_URL`
- **ตรวจสอบ `.env.local`:**
  - ไฟล์ต้องอยู่ที่ root ของโปรเจกต์
  - ชื่อตัวแปรถูกต้อง ไม่มีการพิมพ์ผิด
  - **ต้อง Restart Server (`npm run dev`) ทุกครั้งหลังแก้ไขไฟล์**

### 3.2. ตรวจสอบการโหลด Environment Variables
ใช้ `console.log` ในไฟล์ `options.ts` เพื่อยืนยันว่าโปรแกรมสามารถอ่านค่าจาก `.env.local` ได้จริง ผลการตรวจสอบพบว่า **โปรแกรมอ่านค่าได้ปกติ**

### 3.3. ตรวจสอบการตั้งค่าฝั่ง Google Cloud (ขั้นตอนล่าสุด)
เมื่อยืนยันว่าโปรแกรมอ่านค่า env ได้ ปัญหาจึงน่าจะเกิดจากการตั้งค่าฝั่ง Google ที่ไม่ถูกต้อง
- **Authorized redirect URIs:**
  - ในหน้า Credentials ของ Google Cloud Console
  - ต้องเพิ่ม `http://localhost:3000/api/auth/callback/google` เข้าไป
- **OAuth Consent Screen:**
  - หากสถานะเป็น `Testing` จะต้องเพิ่มอีเมลผู้ใช้ทดสอบในแท็บ `Test users`

**สถานะปัจจุบัน:** กำลังตรวจสอบความถูกต้องของการตั้งค่าใน Google Cloud Console เนื่องจากเป็นสาเหตุที่มีความเป็นไปได้สูงสุดที่เหลืออยู่

### 4. การตั้งค่า Redux Store

- **ติดตั้ง Library** ด้วยคำสั่ง `npm install @reduxjs/toolkit react-redux`
- **สร้างโครงสร้างไฟล์สำหรับ Redux** ภายในโฟลเดอร์ `src/redux/`:
    - `store.ts`: ใช้ `configureStore` เพื่อสร้าง Redux store หลัก
    - `hooks.ts`: สร้าง `useAppDispatch` และ `useAppSelector` ที่เป็น Typed-version เพื่อความปลอดภัยของข้อมูล
    - `provider.tsx`: สร้าง Custom Provider (`<Providers>`) เพื่อครอบแอปพลิเคชัน
- **นำ Provider ไปใช้งาน** โดยการ import `Providers` มาครอบ `children` ในไฟล์ `app/layout.tsx` เพื่อให้ทุก Component เข้าถึง Store ได้

---

### 5. การแก้ปัญหา TypeScript: Cannot find module

- **ปัญหา:** พบข้อผิดพลาด `Cannot find module '@/redux/provider'` ในไฟล์ `layout.tsx`
- **สาเหตุ:** TypeScript ไม่รู้จัก "Path Alias" หรือชื่อย่อ `@/`
- **การแก้ไข:**
    - **อัปเดตไฟล์ `tsconfig.json`** โดยเพิ่มการตั้งค่า `baseUrl` และ `paths` ภายใน `compilerOptions` เพื่อบอกให้ TypeScript รู้ว่า `@/` หมายถึงโฟลเดอร์ `src/`

      ```json
      "compilerOptions": {
        "baseUrl": ".",
        "paths": {
          "@/*": ["./src/*"]
        }
      }
      ```
    - **Restart** โปรแกรมแก้ไขโค้ด หรือ TypeScript Server เพื่อให้โหลดการตั้งค่าใหม่

**สถานะปัจจุบัน:** ระบบยืนยันตัวตนด้วย Next-Auth และโครงสร้างของ Redux Store ได้รับการตั้งค่าและแก้ไขปัญหาเบื้องต้นเรียบร้อยแล้ว พร้อมสำหรับขั้นตอนถัดไปในการสร้างหน้าตาของแอปพลิเคชัน (Markup)