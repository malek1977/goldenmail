// API client — يستخدم الـ backend API
// في dev: يطلب من localhost:5000 (rewrites تلقائي)
// في prod: يستدعي نفس النطاق (الـ backend proxy عبر Apache)
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Auto attach token
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("admin-token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401 && typeof window !== "undefined") {
      // فقط لو كنا في /admin
      if (window.location.pathname.startsWith("/admin") && !window.location.pathname.includes("login")) {
        localStorage.removeItem("admin-token");
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

export default api;