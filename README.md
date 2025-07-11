# สรุปขั้นตอนการสร้าง Kanban Task Management App (Next.js, Next-Auth, Firebase)

เอกสารนี้สรุปขั้นตอนการพัฒนาและแก้ไขปัญหาที่พบระหว่างการสร้างโปรเจกต์ Kanban App ตามบทช่วยสอน โดยครอบคลุมตั้งแต่การตั้งค่าโปรเจกต์, การติดตั้งระบบยืนยันตัวตน, การตั้งค่า Redux Store, การสร้างหน้าตาแอปพลิเคชัน และการจัดการข้อมูลเบื้องต้นกับ Firebase

---

## 1. การตั้งค่าโปรเจกต์เริ่มต้น (Initial Project Setup)

-   **สร้างโปรเจกต์ Next.js** ด้วยคำสั่ง `npx create-next-app@latest` พร้อมเปิดใช้งาน **TypeScript** และ **Tailwind CSS**
-   **ทำความสะอาดโปรเจกต์** โดยลบโค้ดเริ่มต้นใน `app/page.tsx` และ `app/globals.css`

---

## 2. การติดตั้งและตั้งค่า Next-Auth

-   **ติดตั้ง Library** ด้วยคำสั่ง `npm install next-auth`
-   **สร้างโครงสร้าง API Route** ที่ `app/api/auth/[...nextauth]/` พร้อมไฟล์ `options.ts` และ `route.ts`
-   **ตั้งค่า Environment Variables** ในไฟล์ `.env.local`
-   **สร้าง Middleware** ในไฟล์ `middleware.ts` เพื่อป้องกัน Route

---

## 3. การแก้ปัญหา Next-Auth: Configuration 500 Error

-   **ปัญหา:** พบข้อผิดพลาด `GET /api/auth/error?error=Configuration 500`
-   **การแก้ไข:** ตรวจสอบ `options.ts` และการตั้งค่าใน **Google Cloud Console** (Authorized redirect URIs, OAuth Consent Screen)

---

## 4. การตั้งค่า Redux Store

-   **ติดตั้ง Library** ด้วยคำสั่ง `npm install @reduxjs/toolkit react-redux`
-   **สร้างโครงสร้างไฟล์สำหรับ Redux** ภายในโฟลเดอร์ `src/redux/` (`store.ts`, `hooks.ts`, `provider.tsx`, `rootReducer.ts`)
-   **นำ Provider ไปใช้งาน** โดยการครอบ `children` ในไฟล์ `app/layout.tsx`
-   **แก้ปัญหา Redux Initialization** โดยการสร้าง `placeholderSlice.ts` ชั่วคราว และเพิ่ม `appSlice` เข้าไปใน `rootReducer`

---

## 5. การตั้งค่า RTK Query และ API Slice

-   **สร้าง API Slice** ที่ `src/redux/services/apiSlice.ts` โดยใช้ `createApi` และ `fakeBaseQuery` เพื่อกำหนด endpoint สำหรับดึงข้อมูลจาก Firestore
-   **รวม Reducer** โดยใช้ `combineReducers` ใน `rootReducer.ts`
-   **อัปเดต `store.ts`** ให้มี `middleware` ของ RTK Query และเปิดใช้งาน `setupListeners`

---

## 6. การสร้างหน้าตาแอปพลิเคชัน (UI Markup)

-   **สร้างโฟลเดอร์ `components`** และสร้าง UI components ทั้งหมด (`Navbar.tsx`, `Dropdown.tsx`, `Sidebar.tsx`, `BoardTasks.tsx`)
-   **ประกอบ Components** เข้าด้วยกันใน `layout.tsx` และ `page.tsx`
-   **ปรับแก้ `layout.tsx`**: เพิ่ม `className` ให้กับแท็ก `<body>` เพื่อจัดการการแสดงผลและการ scroll

---

## 7. การเชื่อมต่อ Firebase และการจัดการข้อมูลเบื้องต้น

-   **ตั้งค่า Firebase Firestore** โดยสร้างโปรเจกต์, ติดตั้ง `firebase`, และสร้างไฟล์ `firebaseConfig.ts`
-   **แก้ไขกฎ (Rules)** ของ Firestore เป็น `allow read, write: if true;` สำหรับการพัฒนา
-   **เพิ่มข้อมูลเริ่มต้นให้ผู้ใช้ใหม่** โดยใช้ `getSession` และ `addDoc` ใน `page.tsx` เพื่อสร้าง document เริ่มต้นให้ใน Firestore
-   **แก้ปัญหาการเชื่อมต่อ** ที่เกิดจาก `firebaseConfig` ว่าง และ Type ที่ไม่ถูกต้องใน `page.tsx`

---

## 8. การนำข้อมูลมาแสดงผล (Data Population)

-   **Navbar**: อัปเดต `Navbar.tsx` ให้ใช้ `useFetchDataFromDbQuery` เพื่อดึงข้อมูล และ `useEffect` เพื่อ dispatch action (`setPageTitle`) ไปยัง Redux store เพื่อแสดงชื่อบอร์ดปัจจุบัน
-   **Sidebar**: อัปเดต `Sidebar.tsx` ให้ดึงข้อมูลบอร์ดทั้งหมดมาแสดงเป็นรายการ และจัดการ state ของบอร์ดที่กำลัง active เพื่อเปลี่ยน UI และ dispatch action เมื่อผู้ใช้คลิกสลับบอร์ด
-   **BoardTasks**:
    -   ติดตั้ง `react-icons` สำหรับไอคอน
    -   อัปเดต `BoardTasks.tsx` ให้ดึงข้อมูลทั้งหมด และใช้ `useEffect` ร่วมกับ `useAppSelector` เพื่อกรองหาข้อมูลเฉพาะของบอร์ดที่กำลัง active อยู่
    -   นำข้อมูลคอลัมน์และ Task มาแสดงผล พร้อมจัดการ UI สำหรับบอร์ด/คอลัมน์ที่ว่าง และปุ่มสำหรับเพิ่มคอลัมน์ใหม่

---

## 9. การสร้าง Mutation Endpoint (พื้นฐาน CRUD)

-   **เพิ่ม Mutation Endpoint**: แก้ไขไฟล์ `apiSlice.ts` เพื่อเพิ่ม `updateBoardToDb` endpoint โดยใช้ `builder.mutation`
-   **ใช้ `updateDoc`**: ภายใน mutation ใหม่นี้ ได้ใช้ฟังก์ชัน `updateDoc` จาก Firestore เพื่ออัปเดตข้อมูลบอร์ดทั้งหมดของผู้ใช้
-   **เปิดใช้ Auto-Refetch**: กำหนด `invalidatesTags: ["Tasks"]` ซึ่งเป็นหัวใจสำคัญของ RTK Query ที่จะสั่งให้แอปดึงข้อมูลใหม่โดยอัตโนมัติทุกครั้งหลังจากการอัปเดตสำเร็จ
-   **Export Hook ใหม่**: ทำให้ตอนนี้มี hook `useUpdateBoardToDbMutation` พร้อมใช้งานในคอมโพเนนต์ต่างๆ แล้ว

---

## 10. การสร้าง Modal และจัดการสถานะด้วย Redux

-   **ติดตั้ง Library**: ติดตั้ง `react-modal` และ `@types/react-modal` เพื่อสร้าง Modal
-   **สร้าง Modal พื้นฐาน**: สร้าง `Modal.tsx` ที่เป็น Generic component สำหรับการแสดงผล Modal และ `ModalBody` สำหรับเนื้อหา
-   **สร้าง Modal เฉพาะทาง**: สร้าง `AddAndEditBoardModal.tsx` เพื่อใช้สำหรับเพิ่มและแก้ไขบอร์ดโดยเฉพาะ
-   **จัดการสถานะด้วย Redux**: อัปเดต `appSlice.ts` ให้มี state สำหรับควบคุมการเปิด-ปิด (`isOpen`) และประเภท (`variant`) ของ Modal พร้อมสร้าง actions (`open/close...`) และ selectors
-   **เชื่อมต่อ Triggers**: อัปเดตปุ่มต่างๆ ใน `Sidebar`, `Dropdown`, และ `BoardTasks` ให้ `dispatch` action `openAddAndEditBoardModal` เพื่อเปิด Modal ตามบริบทที่ต้องการ

---

## 11. การสร้างฟังก์ชันและฟอร์มใน Modal (Add/Edit Board)

-   **เตรียม Logic**: ใน `AddAndEditBoardModal.tsx` ได้ประกาศ state และ hooks ที่จำเป็นทั้งหมดสำหรับจัดการข้อมูลในฟอร์มและการเชื่อมต่อกับฐานข้อมูล
-   **สร้างฟังก์ชันจัดการฟอร์ม**: เพิ่มฟังก์ชัน `handle...` ต่างๆ เพื่อจัดการการเปลี่ยนแปลงข้อมูลใน input, การเพิ่ม/ลบคอลัมน์, และการตรวจสอบข้อมูล (validation) ก่อน submit
-   **สร้างฟังก์ชัน Submit**: สร้าง `handleAddNewBoardToDb` และ `handleEditBoardToDb` เพื่อรวบรวมข้อมูลจาก form state และส่งไปให้ hook `updateBoardToDbMutation`
-   **สร้าง UI ของฟอร์ม**: นำ state และ handler functions มาผูกกับ JSX เพื่อสร้างฟอร์มสำหรับกรอกชื่อบอร์ดและคอลัมน์ พร้อมแสดงผล error และเปลี่ยนข้อความในปุ่มตามบริบท (Add/Edit)

---

**สถานะปัจจุบัน:** ฟังก์ชัน **Create** และ **Update** สำหรับ **Boards** เสร็จสมบูรณ์แล้ว ผู้ใช้สามารถเพิ่มบอร์ดใหม่และแก้ไขบอร์ดที่มีอยู่ได้ ข้อมูลจะถูกบันทึกลง Firestore และ UI จะอัปเดตอัตโนมัติ ขั้นตอนต่อไปคือการสร้างฟังก์ชันสำหรับ "เพิ่ม" และ "แก้ไข" **Tasks**