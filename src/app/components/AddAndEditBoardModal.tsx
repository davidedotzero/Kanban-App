import { Modal, ModalBody } from "./Modal";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    getAddAndEditBoardModalValue,
    getAddAndEditBoardModalVariantValue,
    closeAddAndEditBoardModal,
    getCurrentBoardName,
} from "@/redux/features/appSlice";

import { useEffect, useState } from "react";
import {
    useFetchDataFromDbQuery,
    useUpdateBoardToDbMutation
} from "@/redux/services/apiSlice";

import { FaTimes } from "react-icons/fa";
import { id } from "@/utils/data";

interface IBoardData {
    id: string;
    name: string;
    columns: {
        id: string;
        name: string;
        tasks?: {
            [key: string]: any;
        }[];
    }[];
}

let addBoardData: IBoardData = {
    id: id(),
    name: "",
    columns: [
        {
            id: id(),
            name: "",
            tasks: []
        },
    ],
};


export default function AddAndEditBoardModal() {
    //จัดการข้อมูลบอร์ด
    const [boardData, setBoardData] = useState<IBoardData>(addBoardData);
    //จัดการชื่อบอร์ด
    const [isBoardNameEmpty, setIsBoardNameEmpty] = useState<boolean>(true);
    //จัดการชื่อคอลัมน์
    const [emptyColumnIndex, setEmptyColumnIndex] = useState<number | null>(null);

    //ดึงข้อมูลบอร์ดจากฐานข้อมูล
    const modalVariant = useAppSelector(getAddAndEditBoardModalVariantValue);
     const isVariantAdd = modalVariant === "Add New Board";
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(getAddAndEditBoardModalValue);
    const currentBoardTitle = useAppSelector(getCurrentBoardName);
    const closeModal = () => dispatch(closeAddAndEditBoardModal());

    let { data } = useFetchDataFromDbQuery();
    const [updateBoardToDb, { isLoading}] = useUpdateBoardToDbMutation();

    useEffect(() => {
    if (data) {
      if (isVariantAdd) {
        // ถ้าเป็น modal "Add New" ให้ใช้ข้อมูลจำลองที่เตรียมไว้
        setBoardData(addBoardData);
      } else {
        // ถ้าเป็น modal "Edit" ให้ค้นหาข้อมูลของบอร์ดที่ active อยู่
        const activeBoard = data[0].boards.find(
          (board: { name: string }) => board.name === currentBoardTitle
        );
        setBoardData(activeBoard);
      }
    }
  }, [data, modalVariant, isVariantAdd, currentBoardTitle]);

  // Effect สำหรับล้างข้อความ error หลังจากผ่านไป 3 วินาที
  useEffect(() => {
    if (isBoardNameEmpty || emptyColumnIndex !== undefined) {
      const timeoutId = setTimeout(() => {
        setIsBoardNameEmpty(false);
        setEmptyColumnIndex(null);
      }, 3000);
      return () => clearTimeout(timeoutId);
    }
  }, [emptyColumnIndex, isBoardNameEmpty]);


  // Handler สำหรับจัดการการเปลี่ยนแปลงชื่อบอร์ด
  const handleBoardNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (boardData) {
      const newName = { ...boardData, name: e.target.value };
      setBoardData(newName);
    }
  };

  // Handler สำหรับจัดการการเปลี่ยนแปลงชื่อคอลัมน์ (ฟังก์ชันแบบนี้เรียกว่า closure)
  const handleColumnNameChange = (index: number) => {
    return function (e: React.ChangeEvent<HTMLInputElement>) {
      if (boardData) {
        const modifyColumns = boardData.columns.map((column, columnIndex) => {
          if (columnIndex === index) {
            return { ...column, name: e.target.value };
          }
          return column;
        });
        const modifiedColumnData = { ...boardData, columns: modifyColumns };
        setBoardData(modifiedColumnData);
      }
    };
  };

  // Handler สำหรับเพิ่มคอลัมน์ใหม่ในฟอร์ม
  const handleAddNewColumn = () => {
    // กำหนดให้มีคอลัมน์สูงสุดได้ไม่เกิน 7
    if (boardData && boardData.columns.length < 7) {
      const newColumn = { id: id(), name: "", tasks: [] };
      const updatedBoardData = {
        ...boardData,
        columns: [...boardData.columns, newColumn],
      };
      setBoardData(updatedBoardData);
    }
  };

  // Handler สำหรับลบคอลัมน์ในฟอร์ม
  const handleDeleteColumn = (index: number) => {
    if (boardData) {
      const filteredColumns = boardData.columns.filter(
        (_column, columnIndex) => columnIndex !== index
      );
      setBoardData({ ...boardData, columns: filteredColumns });
    }
  };

  // Handler สำหรับการตรวจสอบและส่งข้อมูล
  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // 1. ตรวจสอบ validation
    const isNameEmpty = boardData?.name === "";
    const emptyColumn = boardData?.columns.find(col => col.name === "");

    if (isNameEmpty) {
      setIsBoardNameEmpty(true);
    }
    if (emptyColumn) {
      const colIndex = boardData?.columns.findIndex(col => col.name === "");
      setEmptyColumnIndex(colIndex);
    }

    // 2. ถ้า validation ผ่าน ให้เรียกฟังก์ชันที่ถูกต้อง
    if (!isNameEmpty && !emptyColumn) {
      if (isVariantAdd) {
        handleAddNewBoardToDb();
      } else {
        handleEditBoardToDb();
      }
    }
  };

  // Handler สำหรับเพิ่มบอร์ดใหม่ลงในฐานข้อมูล
  const handleAddNewBoardToDb = () => {
    if (data && boardData) {
      const [boards] = data;
      const newBoardsArray = [...boards.boards, boardData];
      updateBoardToDb(newBoardsArray);
      closeModal(); // ปิด modal หลัง submit
    }
  };

  // Handler สำหรับแก้ไขบอร์ดในฐานข้อมูล
  const handleEditBoardToDb = () => {
    if (data && boardData) {
      const [boards] = data;
      const boardsCopy = [...boards.boards];
      const activeBoardIndex = boardsCopy.findIndex(
        (board: { name: string }) => board.name === currentBoardTitle
      );
      
      if (activeBoardIndex !== -1) {
        boardsCopy[activeBoardIndex] = boardData;
        updateBoardToDb(boardsCopy);
        closeModal(); // ปิด modal หลัง submit
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={closeModal}>
      <ModalBody>
        {/* แสดง UI ต่อเมื่อ boardData พร้อมใช้งาน */}
        {boardData && (
          <>
            {/* แสดงหัวข้อของ modal (Add New / Edit) */}
            <p className="text-lg font-bold capitalize">{modalVariant} Board</p>
            <div className="py-6">
              <div>
                <label htmlFor="boardName" className="text-sm font-bold">
                  Board Name
                </label>
                <div className="pt-2">
                  <input
                    id="boardName"
                    className={`${
                      isBoardNameEmpty ? "border-red-500" : "border-stone-200"
                    } border w-full p-2 rounded text-sm cursor-pointer focus:outline-blue-500`}
                    placeholder="e.g. Web Design"
                    value={boardData.name}
                    onChange={handleBoardNameChange}
                  />
                </div>
                {/* แสดง error ถ้าชื่อบอร์ดว่าง */}
                {isBoardNameEmpty && (
                  <p className="text-xs text-red-500 pt-1">
                    Board name cannot be empty
                  </p>
                )}
              </div>

              <div className="mt-6">
                <label htmlFor="" className="text-sm font-bold">
                  Board Columns
                </label>
                {boardData.columns.map((column, index) => (
                  <div key={column.id} className="pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        className={`${
                          emptyColumnIndex === index
                            ? "border-red-500"
                            : "border-stone-200"
                        } border focus:outline-blue-500 text-sm cursor-pointer w-full p-2 rounded`}
                        placeholder="e.g. Doing"
                        onChange={handleColumnNameChange(index)}
                        value={column.name}
                      />
                      <FaTimes
                        onClick={() => handleDeleteColumn(index)}
                        className="cursor-pointer text-gray-400 hover:text-red-500"
                      />
                    </div>
                    {/* แสดง error ถ้าชื่อคอลัมน์ว่าง */}
                    {emptyColumnIndex === index && (
                      <p className="text-xs text-red-500 pt-1">
                        Column name cannot be empty
                      </p>
                    )}
                  </div>
                ))}
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={handleAddNewColumn}
                    className="bg-stone-200 hover:bg-stone-300 rounded-3xl py-2 w-full text-sm font-bold text-blue-500"
                  >
                    + Add New Column
                  </button>
                </div>
              </div>
              <div className="pt-6">
                <button
                  type="submit"
                  onClick={handleSubmit} // 👈 เรียกใช้ฟังก์ชัน handleSubmit
                  className="bg-blue-500 hover:bg-blue-600 text-white rounded-3xl py-2 w-full text-sm font-bold"
                >
                  {/* ข้อความในปุ่มจะเปลี่ยนไปตาม variant และสถานะ loading */}
                  {isLoading
                    ? "Loading..."
                    : isVariantAdd
                    ? "Create New Board"
                    : "Save Changes"}
                </button>
              </div>
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  );
}