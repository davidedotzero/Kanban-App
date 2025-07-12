// src/app/components/Navbar.tsx
"use client"

import Dropdown from "./Dropdown"
import { useState, useEffect } from "react"

import { setCurrentBoardName, getCurrentBoardName } from "@/redux/features/appSlice"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"

import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice"


export default function Navbar() {

    const [showDropdown, setShowDropdown] = useState(false)

    const { data, isLoading, error  } = useFetchDataFromDbQuery()
    console.log("RTK Query Status:", { data, isLoading, error });
    const dispatch = useAppDispatch()

    // ใช้ useEffect เพื่ออัพเดตชื่อหน้าเมื่อ data เปลี่ยนแปลง
    useEffect(() => {
        if (data && data.length > 0) {
            const firstItem = data[0];
            if (firstItem && firstItem.boards) {
              if (Array.isArray(firstItem.boards) && firstItem.boards.length > 0) {
                  const activeBoard = firstItem.boards[0];
                  dispatch(setCurrentBoardName(activeBoard.name));
              }
            }
        }
    }, [data, dispatch])

    const currentBoardName = useAppSelector(getCurrentBoardName);
    

  return (
    <nav className="bg-white border flex h-24">
      {/* ส่วนโลโก้ด้านซ้าย */}
      <div className="flex-none w-[18.75rem] border-r-2 flex items-center pl-[2.12rem]">
        <p className="font-bold text-3xl"> Kanban App </p>
      </div>

      {/* ส่วนเนื้อหาหลักของ Navbar */}
      <div className="flex justify-between w-full items-center pr-[2.12rem]">
        <p className="text-black text-2xl font-bold pl-6">{currentBoardName}</p>

        <div className="flex items-center space-x-3">
          <button className="bg-blue-500 text-black px-4 py-2 flex rounded-3xl items-center space-x-2">
            <p>+ Add New Task</p>
          </button>
          <div className="relative flex items-center">
            {/* ปุ่ม ... (Ellipsis) */}
            <button 
                onClick={() => setShowDropdown(!showDropdown)}
            className="text-3xl mb-4">...</button>
            <Dropdown show={showDropdown} />
          </div>
        </div>
      </div>
    </nav>
  )
}