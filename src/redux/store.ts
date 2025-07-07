//store.ts

import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Redux Store
export const store = configureStore({
  reducer: {
    // Add your reducers here
  },
  // Add any middleware if needed
});

setupListeners(store.dispatch);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

//ในโค้ดส่วนนี้ configureStore ถูกใช้เพื่อสร้าง Redux store และ setupListeners ถูกเรียกใช้เพื่อจัดการพฤติกรรมต่างๆ เช่น refetchOnFocus และ refetchOnReconnect