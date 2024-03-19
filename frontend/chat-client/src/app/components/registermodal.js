'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";

const RegisterModal = ({ publicKey, privateKey }) => {
  const [showModal, setShowModal] = useState(true);
  const [copiedKey, setCopiedKey] = useState(null);
  const router = useRouter();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(text);
  };

  useEffect(() => {
    if (copiedKey) {
      const timer = setTimeout(() => {
        setCopiedKey(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [copiedKey]);

  const downloadKeys = () => {
    const keys = `Public Key: ${publicKey}\nPrivate Key: ${privateKey}`;
    const element = document.createElement("a");
    const file = new Blob([keys], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "account_keys.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div>
      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <p className="text-xl font-semibold mb-4">You will only be displayed the information once</p>
            <p className="text-xl font-semibold mb-4">Account Created Successfully</p>
            <div className="mb-4">
              <p className="font-semibold">Public Key:</p>
              <div className="flex items-center">
                <textarea value={publicKey} readOnly className="w-full rounded border-gray-300 py-1 px-2 bg-gray-100 text-red-500" />
                <button onClick={() => copyToClipboard(publicKey)} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded">Copy</button>
                {copiedKey === publicKey && <span className="ml-2 text-gray-500">Copied!</span>}
              </div>
            </div>
            <div className="mb-4">
              <p className="font-semibold">Private Key:</p>
              <div className="flex items-center">
                <textarea value={privateKey} readOnly className="w-full rounded border-gray-300 py-1 px-2 bg-gray-100 text-green-500" />
                <button onClick={() => copyToClipboard(privateKey)} className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded">Copy</button>
                {copiedKey === privateKey && <span className="ml-2 text-gray-500">Copied!</span>}
              </div>
            </div>
            <div className="mb-4">
              <button onClick={downloadKeys} className="bg-green-500 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded">Download Keys</button>
            </div>
            <button onClick={() => router.push('/login')} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Close and Login</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterModal;
