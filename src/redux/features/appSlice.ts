// src/redux/features/appSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// กำหนด state เริ่มต้นสำหรับ slice
const initialState = {
  currentBoardName: "",
};

export const features = createSlice({
  // ชื่อของ slice
  name: "features",
  initialState,
  // ฟังก์ชันที่อัปเดต initialState จะถูกเขียนไว้ในอ็อบเจกต์ reducers
  reducers: {
    // ฟังก์ชันนี้จะอัปเดตชื่อบอร์ดเมื่อถูกเรียกใช้
    setPageTitle: (state, action: PayloadAction<string>) => {
      state.currentBoardName = action.payload;
    },
  },
});

// Export ฟังก์ชันที่กำหนดไว้ใน reducers ที่นี่
export const { setPageTitle } = features.actions;

// ฟังก์ชัน Selector สำหรับดึงชื่อบอร์ดปัจจุบันออกจาก state
export const getPageTitle = (state: RootState) => state.features.currentBoardName;

// Export reducer เพื่อนำไปใช้ใน Redux store
export default features.reducer;