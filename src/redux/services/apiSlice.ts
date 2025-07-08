// src/redux/services/apiSlice.ts

import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { getSession } from "next-auth/react";
import { collection, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "@/utils/firebaseConfig";

// สร้าง Firestore API โดยใช้ createApi
export const fireStoreApi = createApi({
  reducerPath: "firestoreApi",
  baseQuery: fakeBaseQuery(),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    fetchDataFromDb: builder.query<{ [key: string]: any }[], void>({
      async queryFn() {
        try {
          const session = await getSession();
          if (!session?.user?.email) {
            throw new Error("User not logged in");
          }
          const { user } = session;
          const ref = collection(db, `users/${user.email}/tasks`);
          const querySnapshot = await getDocs(ref);
          return { data: querySnapshot.docs.map((doc) => doc.data()) };
        } catch (e) {
          return { error: e };
        }
      },
      providesTags: ["Tasks"],
    }),

updateBoardToDb: builder.mutation({
  async queryFn(boardData) {
    try {
      const session = await getSession();
      if (session?.user?.email) {
        const { user } = session;
        const ref = collection(db, `users/${user.email}/tasks`);
        const querySnapshot = await getDocs(ref);
        const boardDocId = querySnapshot.docs[0]?.id;
        if (boardDocId) {
          await updateDoc(doc(db, `users/${user.email}/tasks/${boardDocId}`), {
            boards: boardData,
          });
        } else {
          throw new Error("Board document not found");
        }
      }
      return { data: null };
    } catch (e) {
      return { error: e };
    }
  },
  invalidatesTags: ["Tasks"], 
   }),
  }),
});

// Export hooks สำหรับการใช้งาน endpoint ที่สร้างขึ้น
export const { useFetchDataFromDbQuery, useUpdateBoardToDbMutation } = fireStoreApi;