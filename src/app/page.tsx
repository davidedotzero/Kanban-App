// src/app/page.tsx
"use client";
import Sidebar from "./components/Sidebar";
import BoardTasks from "./components/BoardTasks";

import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../utils/firebaseConfig";
import { useEffect, useState } from "react";

import { getSession } from "next-auth/react";
import { type Session } from "next-auth";

import { data } from "../utils/data";

import AddAndEditBoardModal from "./components/AddAndEditBoardModal";

export default function Home() {
  const [ userDetails, setUserDetails ] = useState<Session["user"] | null>(null);

  const getUserSession  = async () => {
    const session = await getSession();
    if (session && session.user) {
      setUserDetails(session.user);
    }
  };

  const handleAddDoc = async () => {
    if (userDetails && userDetails.email) {
      const docRef = collection(db, "users", userDetails.email, "tasks");
      const querySnapshot = await getDocs(docRef);

      if (querySnapshot.docs.length > 0) {
        return;
      } else {
        try {
          await addDoc(docRef, data);
        } catch (error) {
          console.error("Error adding document: ", error);
        }
      }
    }
  };

  useEffect(() => {
    getUserSession();
  }, []);

  useEffect(() => {
    handleAddDoc();
  }, [userDetails]);

  return (
    <main className="flex h-full">
      <Sidebar />
      <BoardTasks />
      <AddAndEditBoardModal />
    </main>
  );
}