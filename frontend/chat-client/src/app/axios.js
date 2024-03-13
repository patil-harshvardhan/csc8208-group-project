import axios from "axios";
export default axios.create({
  baseURL: "backend:8080",
});