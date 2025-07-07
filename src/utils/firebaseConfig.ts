// utils/firebaseConfig.ts

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// ข้อมูลการตั้งค่า Firebase สำหรับเว็บแอปของคุณ
const firebaseConfig = {
  apiKey: "AIzaSyDd6O4Ko934fkSKkq6v07_htSMlslw301g",

  authDomain: "kanban-app-7e78d.firebaseapp.com",

  projectId: "kanban-app-7e78d",

  storageBucket: "kanban-app-7e78d.firebasestorage.app",

  messagingSenderId: "869238380973",

  appId: "1:869238380973:web:a5557725deb8730878e924",

  measurementId: "G-DELRYRTY53"

};

// เริ่มต้นการทำงานของ Firebase
const app = initializeApp(firebaseConfig);

// เริ่มต้นการทำงานของ Firestore และ export ออกไปใช้งาน
export const db = getFirestore(app);