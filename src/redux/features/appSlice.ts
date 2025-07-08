// src/redux/features/appSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// กำหนด state เริ่มต้นสำหรับ slice
const initialState = {
  currentBoardName: "",
  isAddAndEditBoardModal: { isOpen: false, variant: "" },
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
    // ฟังก์ชันนี้จะเปิดหรือปิด modal สำหรับการเพิ่มและแก้ไขบอร์ด
    openAddAndEditBoardModal: (
      state,
      { payload }: PayloadAction<string>
    ) => {
      state.isAddAndEditBoardModal.isOpen = true;
      state.isAddAndEditBoardModal.variant = payload;
    },
    // ฟังก์ชันนี้จะปิด modal สำหรับการเพิ่มและแก้ไขบอร์ด
    closeAddAndEditBoardModal: (state) => {
      state.isAddAndEditBoardModal.isOpen = false;
      state.isAddAndEditBoardModal.variant = "";
    },
  },
});

export const {
  setPageTitle,
  openAddAndEditBoardModal,
  closeAddAndEditBoardModal,
} = features.actions;

// ฟังก์ชัน Selector สำหรับดึงชื่อบอร์ดปัจจุบันออกจาก state
export const getPageTitle = (state: RootState) => 
  state.features.currentBoardName;

export const getAddAndEditBoardModalValue = (state: RootState) => 
  state.features.isAddAndEditBoardModal.isOpen;

export const getAddAndEditBoardModalVariantValue = (state: RootState) => 
  state.features.isAddAndEditBoardModal.variant;


// Export reducer เพื่อนำไปใช้ใน Redux store
export default features.reducer;