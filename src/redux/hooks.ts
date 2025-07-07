import {  TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './store';

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

//โค้ดนี้เป็นการสร้าง hook useDispatch และ  useSelector เวอร์ชันที่กำหนดประเภทข้อมูล (typed versions) ไว้ เพื่อให้เกิดความปลอดภัยของประเภทข้อมูล (type safety) เมื่อมีการโต้ตอบกับ Redux store