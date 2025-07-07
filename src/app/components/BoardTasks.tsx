// src/app/components/BoardTasks.tsx
import { useEffect, useState } from "react";
import { useFetchDataFromDbQuery } from "@/redux/services/apiSlice";
import { useAppSelector } from "@/redux/hooks";
import { getPageTitle } from "@/redux/features/appSlice";
import { MdEdit, MdDelete } from "react-icons/md";

interface ITask {
  id: string;
  title: string;
  description: string;
  status: string;
}

interface Column {
  id: string;
  name: string;
  tasks: ITask[];
}

export default function BoardTasks() {
  const { isLoading, data } = useFetchDataFromDbQuery();
  const [columns, setColumns] = useState<Column[]>([]);
  const currentBoardName = useAppSelector(getPageTitle);

  useEffect(() => {
    if (data !== undefined && data.length > 0) {
      const [boardData] = data;
      if (boardData && boardData.boards) {
        // ค้นหาบอร์ดที่ตรงกับชื่อบอร์ดที่ active
        const activeBoardData = boardData.boards.find(
          (board: { name: string }) => board.name === currentBoardName
        );
        if (activeBoardData) {
          setColumns(activeBoardData.columns);
        }
      }
    }
  }, [data, currentBoardName]);

  return (
    <div className="overflow-x-auto overflow-y-auto w-full p-6 bg-stone-200">
      {/* ถ้ายังดึงข้อมูลไม่สำเร็จ ให้แสดงสถานะ loading, มิฉะนั้นให้แสดงคอลัมน์ของ task */}
      {isLoading ? (
        <p className="text-3xl w-full text-center font-bold">Loading tasks...</p>
      ) : (
        <>
          {/* ถ้ามีคอลัมน์ของ task อยู่: ให้แสดง tasks, มิฉะนั้นให้แสดงข้อความให้เพิ่มคอลัมน์ใหม่ */}
          {columns.length > 0 ? (
            <div className="flex space-x-6">
              {columns.map((column) => {
                const { id, name, tasks } = column;
                return (
                  <div key={id} className="w-[17.5rem] shrink-0">
                    <p className="text-black">{`${name} (${
                      tasks ? tasks?.length : 0
                    })`}</p>

                    {tasks &&
                      // แสดง tasks หากมี tasks ในคอลัมน์, ถ้าไม่มี ให้แสดงคอลัมน์ว่าง
                      (tasks.length > 0 ? (
                        tasks.map((task) => {
                          const { id, title } = task; // ไม่ได้ใช้ status
                          return (
                            <div
                              key={id}
                              className="bg-white p-6 rounded-md mt-6 flex items-center justify-between border"
                            >
                              <p>{title}</p>
                              <div className="flex items-center space-x-1">
                                <MdEdit className="text-lg cursor-pointer" />
                                <MdDelete className="text-lg cursor-pointer text-red-500" />
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <div className="mt-6 h-full rounded-md border-dashed border-4 border-white" />
                      ))}
                  </div>
                );
              })}
              {/* ถ้าจำนวนคอลัมน์ของ task น้อยกว่า 7, ให้แสดงตัวเลือกเพื่อเพิ่มคอลัมน์ */}
              {columns.length < 7 && (
                <div className="rounded-md bg-white w-[17.5rem] mt-12 shrink-0 flex justify-center items-center">
                  <p className="cursor-pointer font-bold text-black text-2xl">
                    + New Column
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full h-full flex justify-center items-center">
              <div className="flex flex-col items-center">
                <p className="text-black text-sm">
                  This board is empty. Create a new column to get started.
                </p>
                <button className="bg-blue-500 text-black px-4 py-2 flex mt-6 rounded-3xl items-center space-x-2">
                  <p>+ Add New Column</p>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}