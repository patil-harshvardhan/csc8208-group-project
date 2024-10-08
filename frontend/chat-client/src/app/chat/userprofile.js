import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "../axios";
import KeyChangeModal from "./modelmanagekeys";

const UserProfileDropdown = ({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openManageKeys, setOpenManageKeys] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    axiosInstance.post("/logout").then(() => {
      localStorage.removeItem("public_key");
      localStorage.removeItem("private_key");
      router.push("/login");
    });
  };

  return (
    <div className="relative inline-block text-left">
      <div>
        <button
          onClick={() => {setIsOpen(!isOpen)}}
          className="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
        >
          <div className="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
            <svg
              className="absolute w-12 h-12 text-gray-400 -left-1"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                clipRule="evenodd"
              ></path>
            </svg>
          </div>
        </button>
      </div>
      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => {
                setOpenManageKeys(true);
                setIsOpen(false);
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Manage Keys
            </button>
          </div>
          <div className="py-1">
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
        </div>
      )}
      {openManageKeys && <KeyChangeModal isOpen={openManageKeys} onClose={() => setOpenManageKeys(false)}/>}
    </div>
  );
};

export default UserProfileDropdown;
