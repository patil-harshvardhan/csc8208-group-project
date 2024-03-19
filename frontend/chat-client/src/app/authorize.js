"use client";
import { useRouter } from "next/navigation";
import axiosInstance from "./axios";
import { useEffect, useState } from "react";

const Authorize = ({ children }) => {
  // get current route
  const router = useRouter();
  const [userDetails, setUserDetails] = useState(null);
  const checkAuthorization = async () => {
    const whiteListForUnAuthorized = ["/login", "/register", "change-password","/test"];
    const currentPath = window.location.pathname;
    if (whiteListForUnAuthorized.includes(currentPath)) return;
    try {
        console.log("checking auth");
      const result = await axiosInstance.get("/getuserdetails");
      if (result.status === 200) {
        setUserDetails(result.data);
      } else {
        router.push("/login");
      }
    } catch (err) {
        router.push("/login");
    }
  };
  useEffect(() => {
    checkAuthorization();
  }, []);
  return children;
};

export default Authorize;
