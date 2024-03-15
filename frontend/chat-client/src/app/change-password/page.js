"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "../axios";

export default function page() {
  const [email, setEmail] = useState("");
  const [currentPassword, setcurrentPassword] = useState("");
  const [changePassword, setChangePassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const changedPassword = async () => {
    // Perform form validation
    if (!email || !currentPassword || !confirmPassword || !changePassword) {
      setError("All fields are required");
      return;
    }

    if (changePassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const res = await axios.post("/change-password", { email, old_password:currentPassword, new_password:changePassword });
console.log(res)
    if (res.status === 200) {
      console.log("Password Changed Successfully");
      router.push("/login");
    }
   if(res.status === 400){
      setError(res.data.detail)
      console.log(res.data.detail)
      return;
    }

  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      
      <div className="w-full max-w-xs">
      
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="flex items-center justify-center space-x-2 mb-6"><h1 className="text-xl font-semibold">Change Password</h1></div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="text"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            ></input>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="currentPassword"
            >
              Current Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="currentPassword"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setcurrentPassword(e.target.value)}
            ></input>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="changePassword"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="changePassword"
              type="password"
              placeholder="******************"
              value={changePassword}
              onChange={(e) => setChangePassword(e.target.value)}
            ></input>
            {/* <p className="text-red-500 text-xs italic">
              Please choose a password.
            </p> */}
          </div>
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="confirmPassword"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="confirmPassword"
              type="password"
              placeholder="******************"
              value={confirmPassword}
              onChange={(e) => setconfirmPassword(e.target.value)}
            ></input>
            {/* <p className="text-red-500 text-xs italic">Confirm password.</p> */}
          </div>
          {error && (
            <div>
              <p className="text-red-500 text-m font-bold">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={changedPassword}
            >
              Change Password
            </button>
          </div>
        </form>
        <p className="text-center text-gray-500 text-xs">
          &copy;2020 Acme Corp. All rights reserved.
        </p>
      </div>
    </main>
  );
}
