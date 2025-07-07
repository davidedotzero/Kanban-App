// utils/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ข้อมูลการตั้งค่า Firebase สำหรับเว็บแอปของคุณ
const firebaseConfig = {
  // นำ config ที่ได้จาก Firebase มาวางที่นี่
};

// เริ่มต้นการทำงานของ Firebase
const app = initializeApp(firebaseConfig);

// เริ่มต้นการทำงานของ Firestore และ export ออกไปใช้งาน
export const db = getFirestore(app);