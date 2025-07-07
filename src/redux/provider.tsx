"use client";

import { store } from "./store";
import { Provider } from "react-redux";

export function Providers({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}


//ไฟล์นี้จะกำหนด Provider component แบบกำหนดเองเพื่อนำไปครอบ (wrap) คอมโพเนนต์ต่างๆ ในแอปพลิเคชันของคุณ