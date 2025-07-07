//store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

import { fireStoreApi } from './services/apiSlice';
import { rootReducer } from './rootReducer';

// Redux Store
export const store = configureStore({
  reducer: rootReducer,
  // เพิ่ม middleware ของ RTK Query เข้าไป
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(fireStoreApi.middleware),
});


setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//ในโค้ดส่วนนี้ configureStore ถูกใช้เพื่อสร้าง Redux store และ setupListeners ถูกเรียกใช้เพื่อจัดการพฤติกรรมต่างๆ เช่น refetchOnFocus และ refetchOnReconnect

//เมื่อคุณเริ่มสร้าง feature slice จริงๆ (เช่น boardSlice) ในขั้นตอนต่อไปของบทเรียน คุณก็สามารถลบ placeholderSlice นี้ทิ้ง แล้วแทนที่ด้วย reducer ของ feature ใหม่ได้เลยครับ
//ในระหว่างนี้ placeholderSlice นี้จะช่วยให้ store ของคุณมี reducer อย่างน้อยหนึ่งตัวเพื่อให้ Redux Toolkit ทำงานได้อย่างถูกต้อง