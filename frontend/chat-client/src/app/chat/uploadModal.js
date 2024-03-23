import React, { useState } from "react";
import axios from "axios";
import { getAuthToken } from "../axios";

const UploadModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  axios.defaults.baseURL = "http://localhost:8080";
  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/upload-file", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": "Bearer " + getAuthToken(),
        },
      });
      onClose(res.data);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file. Please try again later.");
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">Upload File</h2>
            <input type="file" onChange={handleFileChange} />
            <div className="mt-4 flex justify-end">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                onClick={handleSubmit}
              >
                Upload
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                onClick={onClose}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadModal;
