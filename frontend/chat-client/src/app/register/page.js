"use client";
import {useEffect, useState } from "react";
import axios from "../axios";
import { useRouter } from "next/navigation";

// for e2e encryption
import {JSEncrypt} from 'jsencrypt'
import RegisterModal from "../components/registermodal";

export default function register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  
  const [publicKey, setPublicKey] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);

  const register = async () => {
    // Perform form validation
    if (!username || !email || !password) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const encrypt = new JSEncrypt(process.env.LOCAL_KEY);
    const crypt = new JSEncrypt({default_key_size: 2048});
    const publicKey = crypt.getPublicKey();
    const privateKey = crypt.getPrivateKey();

    const res = await axios.post("/register", {
      username,
      email,
      password,
      public_key: publicKey,
    });

    if (res.status === 200) {
      console.log("User registered successfully", res);
      // TODO: ENCRYPT BEFORE SAVING
      localStorage.setItem("public_key", publicKey);
      localStorage.setItem("private_key", privateKey);
      setPrivateKey(privateKey);
      setPublicKey(publicKey);
    }
  };

  useEffect(()=>{
    console.log("Fired Once Only")
  },[])

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {privateKey && publicKey && <RegisterModal publicKey={publicKey} privateKey={privateKey}/>}
      <div className="w-full max-w-xs">
        <form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="flex items-center justify-center space-x-2 mb-6"><h1 className="text-xl font-semibold">Register New User</h1></div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
          </div>
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
          <div className="mb-6">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="******************"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></input>
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
            <p className="text-red-500 text-xs italic">Confirm password.</p>
          </div>
          {error && (
            <div>
              <p className="text-red-500 text-m italic">{error}</p>
            </div>
          )}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={register}
            >
              Register
            </button>
            <a
              className="inline-block align-baseline font-bold text-md text-blue-500 hover:text-blue-800"
              href="/login"
            >
              Login?
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}
