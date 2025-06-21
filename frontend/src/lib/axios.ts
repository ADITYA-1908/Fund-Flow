// src/lib/axios.ts
import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env. || "http://localhost:5000", // fallback
  withCredentials: true, // optional: if you need to send cookies
});

export default instance;
