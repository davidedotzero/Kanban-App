// src/app/components/Sidebar.tsx

import { useState } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { setPageTitle } from "@/redux/features/appSlice";

export default function Sidebar() {
  const [active, setActive] = useState<number>(0);
  const { data } = useFetchDataFromDbQuery();
  const dispatch = useAppDispatch();

  const handleNav = (index: number, name: string) => {
    setActive(index);
    dispatch(setPageTitle(name));
  };

  return (
   <aside className="w-[18.75rem] flex-none h-full py-6 pr-6">
      {/* ตรวจสอบว่ามี data ก่อนแสดงผล */}
      {data && data.length > 0 && (
        <>
          {/* แสดงจำนวนบอร์ดทั้งหมดที่มีในข้อมูล */}
          <p className="text-medium-grey pl-[2.12rem] text-[.95rem] font-semibold uppercase pb-3">
            {`All Boards (${data[0]?.boards.length})`}
          </p>

          {/* แสดงชื่อของแต่ละบอร์ดโดยใช้ .map */}
          {data[0]?.boards.map(
            (board: { [key: string]: any }, index: number) => {
              const { name, id } = board;
              // ตรวจสอบว่าบอร์ดนี้เป็นบอร์ดที่ active หรือไม่
              const isActive = index === active;
              return (
                <div
                  key={id}
                  // จัดการการสลับบอร์ดเมื่อคลิก
                  onClick={() => handleNav(index, name)}
                  className={`${
                    isActive
                      ? "rounded-tr-full rounded-br-full bg-blue-500 text-white"
                      : "text-black"
                  } cursor-pointer flex items-center 
                  space-x-2 pl-[2.12rem] py-3 pb-3`}
                >
                  <p className="text-lg capitalize">{name}</p>
                </div>
              );
            }
          )}
        </>
      )}
      <button className="flex items-center space-x-2 pl-[2.12rem] py-3">
        <p className="text-base font-bold capitalize text-main-purple">
          + Create New Board
        </p>
      </button>
    </aside>
  );
}