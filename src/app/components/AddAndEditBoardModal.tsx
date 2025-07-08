import { Modal, ModalBody } from "./Modal";
import { useAppSelector, useAppDispatch } from "@/redux/hooks";
import {
    getAddAndEditBoardModalValue,
    getAddAndEditBoardModalVariantValue,
    closeAddAndEditBoardModal
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
    const dispatch = useAppDispatch();
    const isOpen = useAppSelector(getAddAndEditBoardModalValue);
    const closeModal = () => dispatch(closeAddAndEditBoardModal());

    let { data } = useFetchDataFromDbQuery();
    const [updateBoardToDb, { isLoading}] = useUpdateBoardToDbMutation();

    return (
        <Modal isOpen={isOpen} onRequestClose={closeModal}>
            <ModalBody>
                <p className="capitalize font-bold text-xl">{modalVariant}</p>
            </ModalBody>
        </Modal>
    );
}