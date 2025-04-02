// services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://backend-ch-8d6d5a4317ea.herokuapp.com",
});

export default api;
