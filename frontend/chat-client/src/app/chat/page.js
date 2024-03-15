"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../axios";

export default function Page() {
  const [users, setUsers] = useState([]);
  const getPeople = async () => {
    const res = await axiosInstance.get("/get_active_users");
    if (res.status === 200) {
      console.log(res.data);
      setUsers(res.data);
    }
  };

  useEffect(() => {
    console.log("here");
    getPeople();
  }, []);
  return (
    <main>
      <div className="w-full h-32">
        <div className="container mx-auto">
          <div className="py-6 h-screen">
            <div className="flex border border-grey rounded shadow-lg h-full">
              <div className="bg-gray-200 h-full w-1/4 p-4">
                <h1 className="text-lg font-bold mb-4">People</h1>
                <ul>
                  {users.map((user) => (
                    <li
                      className="flex items-center py-2 hover:bg-gray-300 cursor-pointer"
                      key={user.id}
                    >
                      <img
                        src="https://via.placeholder.com/40"
                        alt="User"
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <span className="font-semibold">{user.email || user}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="w-3/4 p-4 flex flex-col items-end">
                <h1 className="text-lg font-bold mb-4">Conversations</h1>
                <div className="bg-white rounded-lg shadow-md p-4 w-full h-full">
                  <div className="flex items-center mb-2">
                    <span className="font-semibold">John Doe</span>
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User"
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  </div>
                  <p className="bg-gray-100 p-2 rounded-lg text-right">
                    Hi there!
                  </p>
                  <div className="flex items-center mt-2">
                    <span className="font-semibold">Jane Smith</span>
                    <img
                      src="https://via.placeholder.com/40"
                      alt="User"
                      className="w-8 h-8 rounded-full ml-2"
                    />
                  </div>
                  <p className="bg-gray-100 p-2 rounded-lg text-right">
                    Hello!
                  </p>
                </div>
                {/* here */}
                <div class="mt-4 flex items-center justify-between w-full">
      <input type="text" placeholder="Type a message..." class="border border-gray-300 rounded-lg px-4 py-2 w-3/4 focus:outline-none focus:border-blue-500"/>
      <button class="bg-blue-500 text-white px-4 py-2 rounded-lg ml-4">Send</button>
    </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
