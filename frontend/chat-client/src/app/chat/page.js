"use client";

import { useEffect, useState } from "react";
import axiosInstance from "../axios";
import RightPanel from "./rightpanel";
import LeftPanel from "./leftpanel";
import { startPolling } from "../helper";
export default function Page() {
  const [ws, setWs] = useState(null);
  const [users, setUsers] = useState([]);
  const [userDetails, setUserDetails] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeUsers, setActiveUsers] = useState([]);



  // const getPeople = async () => {
  //   const res = await axiosInstance.get("/getusers");
  //   if (res.status === 200) {
  //     console.log(res.data);
  //     setUsers(res.data);
  //   }
  // };

  // const getActiveUsers = async () => {
  //   const res = await axiosInstance.get("/get_active_users");
  //   if (res.status === 200) {
  //     console.log(res.data);
  //     setActiveUsers(res.data);
  //   }
  // }

  const getUserDetails = async () => {
    const res = await axiosInstance.get("/getuserdetails");
    if (res.status === 200) {
      console.log(res.data);
      setUserDetails(res.data);
    }
  };

  useEffect(() => {
    if (ws) {
      // getPeople();
      // getActiveUsers();
      startPolling("/getusers", (data) => {
        setUsers(data)
      });
      startPolling("/get_active_users", (data) => {
        setActiveUsers(data)
      });
    };
  }, [ws]);

  useEffect(() => {
    if (!userDetails) getUserDetails();
    if (userDetails && userDetails.id) {
      setWs(new WebSocket(`ws://localhost:8080/ws/${userDetails.id}`));
    }
  }, [userDetails]);

  return (
    <main>
      <div className="w-full h-32">
        <div className="container mx-auto">
          <div className="py-6 h-screen">
            <div className="flex border border-grey rounded shadow-lg h-full">
              <LeftPanel users={users} setSelectedUser={setSelectedUser} userDetails={userDetails} selectedUser={selectedUser} activeUsers={activeUsers}/>
              {selectedUser && <RightPanel ws={ws} selectedUser={selectedUser} userDetails={userDetails}/>}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
