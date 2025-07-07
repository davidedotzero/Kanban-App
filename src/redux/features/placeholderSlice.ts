// src/redux/features/placeholderSlice.ts

import { createSlice } from '@reduxjs/toolkit';

// สร้าง Slice ชั่วคราวขึ้นมาเพื่อให้ store มี reducer
const placeholderSlice = createSlice({
  name: 'placeholder',
  initialState: {},
  reducers: {},
});

export default placeholderSlice.reducer;