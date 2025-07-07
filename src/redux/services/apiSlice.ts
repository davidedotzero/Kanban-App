// src/redux/services/apiSlice.ts

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig"; // ⚠️ ตรวจสอบ path ของคุณ

// สร้าง Firestore API โดยใช้ createApi
export const fireStoreApi = createApi({
  // ระบุ path สำหรับ reducer
  reducerPath: "firestoreApi",
  
  // ใช้ fakeBaseQuery เพราะ Firebase ไม่มี endpoint แบบ REST API ทั่วไป
  baseQuery: fakeBaseQuery(),
  
  // กำหนดประเภทของ tag สำหรับการทำ caching
  tagTypes: ["Tasks"],
  
  endpoints: (builder) => ({
    // ใช้ builder.query สำหรับการดึงข้อมูล; builder.mutation จะใช้สำหรับ CRUD
    fetchDataFromDb: builder.query<{ [key: string]: any }[], void>({
      // เราใช้ queryFn เนื่องจากไม่ได้ดึงข้อมูลจาก API ทั่วไป
      // ซึ่งช่วยให้เราสามารถเขียนโค้ดที่ซับซ้อนได้ ตราบใดที่เรา return data ในรูปแบบ { data: results }
      async queryFn() {
        try {
          const session = await getSession();
          if (!session?.user?.email) {
            throw new Error("User not logged in");
          }
          const { user } = session;
          
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);
          
          // ต้อง return ข้อมูลใน format นี้เมื่อใช้ queryFn
          return { data: querySnapshot.docs.map((doc) => doc.data()) };
        } catch (e) {
          return { error: e };
        }
      },
      // ระบุ tag สำหรับ caching
      providesTags: ["Tasks"],
    }),
  }),
});

// Export hooks สำหรับการใช้งาน endpoint ที่สร้างขึ้น
export const { useFetchDataFromDbQuery } = fireStoreApi;