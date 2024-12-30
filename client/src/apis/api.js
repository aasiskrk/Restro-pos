import axios from "axios";

const API_URL = "http://localhost:5000/api";

// Creating an instance of axios
const Api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if it exists
Api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor to handle token expiration
Api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const registerApi = (data) => Api.post("/auth/register", data);
export const loginApi = (data) => Api.post("/auth/login", data);
export const getCurrentUserApi = () => Api.get("/auth/me");
export const updateProfileApi = (data) => Api.put("/auth/update-profile", data);
export const changePasswordApi = (data) =>
  Api.post("/auth/change-password", data);
export const forgotPasswordApi = (data) =>
  Api.post("/auth/forgot-password", data);
export const resetPasswordApi = (data) =>
  Api.post("/auth/reset-password", data);

// Logout function
export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// Admin Setup
export const setupAdminApi = (adminData) =>
  Api.post("/auth/setup-admin", adminData);

// User Management APIs (Admin only)
export const getAllUsersApi = () => Api.get("/users/all");
export const getUserByIdApi = (id) => Api.get(`/users/user/${id}`);
export const updateUserRoleApi = (id, data) =>
  Api.patch(`/users/role/${id}`, data);
export const toggleUserStatusApi = (id) =>
  Api.patch(`/users/toggle-status/${id}`);
export const deleteUserApi = (id) => Api.delete(`/users/delete/${id}`);
export const getUsersByRoleApi = (role) => Api.get(`/users/role/${role}`);
export const updateWorkScheduleApi = (id, data) =>
  Api.put(`/users/schedule/${id}`, data);
export const searchUsersApi = (query) =>
  Api.get(`/users/search?query=${query}`);

// Restaurant Management APIs (Admin only)
export const getRestaurantDetailsApi = () => Api.get("/auth/restaurant");
export const updateRestaurantDetailsApi = (data) =>
  Api.put("/auth/restaurant", data);

// Menu APIs
export const createMenuItemApi = (data) => Api.post("/menu/create", data);
export const getAllMenuItemsApi = () => Api.get("/menu/all");
export const getMenuItemsByCategoryApi = (category) =>
  Api.get(`/menu/category/${category}`);
export const updateMenuItemApi = (id, data) =>
  Api.put(`/menu/update/${id}`, data);
export const deleteMenuItemApi = (id) => Api.delete(`/menu/delete/${id}`);
export const toggleMenuItemAvailabilityApi = (id) =>
  Api.patch(`/menu/toggle/${id}`);

// Staff Management APIs
export const createStaff = async (staffData) => {
  const response = await Api.post("/staff", staffData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const getAllStaff = async () => {
  const response = await Api.get("/staff");
  return response.data;
};

export const getStaff = async (id) => {
  const response = await Api.get(`/staff/${id}`);
  return response.data;
};

export const updateStaff = async (id, staffData) => {
  const response = await Api.patch(`/staff/${id}`, staffData);
  return response.data;
};

export const deleteStaff = async (id) => {
  const response = await Api.delete(`/staff/${id}`);
  return response.data;
};

// Staff Attendance APIs
export const getAttendanceHistory = async (params) => {
  const response = await Api.get("/staff/attendance-history", { params });
  return response.data;
};

export const updateAttendanceStatus = async (staffId, status) => {
  const response = await Api.put("/staff/attendance", { staffId, status });
  return response.data;
};

export default Api;
