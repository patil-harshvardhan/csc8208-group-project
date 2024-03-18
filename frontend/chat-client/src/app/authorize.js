"use client";
import { useRouter } from "next/navigation";
import axiosInstance from "./axios";
import { useEffect, useState } from "react";

const Authorize = ({ children }) => {
  // get current route
  const [userDetails, setUserDetails] = useState(null);
  const checkAuthorization = async () => {
    const whiteListForUnAuthorized = ["/login", "/register", "change-password"];
    const router = useRouter();
    if (whiteListForUnAuthorized.includes(window.location.pathname)) return;

    axiosInstance
      .get("/getuserdetails")
      .then((res) => {
        if (res.status === 200) {
          console.log("logged in user", res.data);
          setUserDetails(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (!whiteListForUnAuthorized.includes(window.location.pathname)) {
          router.push("/login");
        }
      });
    console.log(window.location.pathname);
  };
  useEffect(()=>{
    checkAuthorization();
  },[])
  return children;
};

export default Authorize;
