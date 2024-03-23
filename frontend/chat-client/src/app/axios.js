// axios.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // Replace with your API base URL
  withCredentials: true, // Include cookies in requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Add a request interceptor to attach the token to each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken(); // Function to retrieve the JWT token (e.g., from cookies)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// axiosInstance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       // Handle 401 error
//     }
//     return Promise.reject(error);
//   }
// );

// Function to retrieve the JWT token from cookies
function getAuthToken() {
  const cookies = document.cookie.split(";");
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split("=");
    if (name === "jwt") {
      return value;
    }
  }
  return null;
}

export default axiosInstance;

export { getAuthToken };
