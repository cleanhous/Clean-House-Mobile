// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://hopeful-youth-production-8fe2.up.railway.app",
});

export default api;
