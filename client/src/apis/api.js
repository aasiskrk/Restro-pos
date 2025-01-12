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
    console.log("API Error Interceptor:", {
      status: error.response?.status,
      url: error.config?.url,
      method: error.config?.method,
    });

    // Handle 401 errors
    if (error.response?.status === 401) {
      console.log("Unauthorized error detected in API call");
      // Only clear auth data if we're not already on the login page
      if (!window.location.pathname.includes("login")) {
        console.log("Clearing auth data...");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
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

// Menu Categories
export const createCategory = async (data) => {
  return await axios.post(`${API_URL}/menu/categories`, data);
};

export const getAllCategories = async () => {
  return await axios.get(`${API_URL}/menu/categories`);
};

export const updateCategory = async (id, data) => {
  return await axios.put(`${API_URL}/menu/categories/${id}`, data);
};

export const deleteCategory = async (id) => {
  return await axios.delete(`${API_URL}/menu/categories/${id}`);
};

// Menu Items
export const createMenuItem = async (data) => {
  const formData = new FormData();
  Object.keys(data).forEach((key) => {
    if (key === "image" && data[key]) {
      formData.append("image", data[key]);
    } else {
      formData.append(key, data[key]);
    }
  });
  return await axios.post(`${API_URL}/menu/items`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllMenuItems = async () => {
  return await axios.get(`${API_URL}/menu/items`);
};

export const getMenuItemsByCategory = async (categoryId) => {
  return await axios.get(`${API_URL}/menu/items/category/${categoryId}`);
};

export const updateMenuItem = async (id, formData) => {
  return await axios.put(`${API_URL}/menu/items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteMenuItem = async (id) => {
  return await axios.delete(`${API_URL}/menu/items/${id}`);
};

// Table APIs
export const createTable = async (data) => {
  return await axios.post(`${API_URL}/table`, data);
};

export const getAllTables = async () => {
  return await axios.get(`${API_URL}/table`);
};

export const updateTable = async (id, data) => {
  return await axios.put(`${API_URL}/table/${id}`, data);
};

export const deleteTable = async (id) => {
  return await axios.delete(`${API_URL}/table/${id}`);
};

export const updateTableStatus = async (tableId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/table/${tableId}/status`,
      status
    );
    return response;
  } catch (error) {
    throw error;
  }
};

// Order APIs
export const createOrder = async (data) => {
  return await axios.post(`${API_URL}/order`, data);
};

export const getAllOrders = async () => {
  return await axios.get(`${API_URL}/order`);
};

export const getActiveOrders = async () => {
  return await axios.get(`${API_URL}/order/active`);
};

export const getOrdersByTable = async (tableId) => {
  return await axios.get(`${API_URL}/order/table/${tableId}`);
};

export const updateOrderStatus = async (id, status) => {
  return await axios.patch(`${API_URL}/order/${id}/status`, { status });
};

export const addItemsToOrder = async (id, items) => {
  return await axios.post(`${API_URL}/order/${id}/items`, { items });
};

export const updateOrder = async (orderId, orderData) => {
  try {
    const response = await axios.put(`${API_URL}/order/${orderId}`, orderData);
    return response;
  } catch (error) {
    throw error;
  }
};

// Dashboard APIs
export const getDashboardStats = async (timeRange = "today") => {
  try {
    const response = await Api.get(`/dashboard/stats?timeRange=${timeRange}`);
    console.log("Dashboard API Response:", response.data);
    return response;
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};

// Payment APIs
export const processCashPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payments/cash`, paymentData);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const initiateEsewaPayment = async (data) => {
  try {
    const response = await axios.post(
      `${API_URL}/payments/esewa/initiate`,
      data
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export const getPaymentStatus = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/payments/status/${orderId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

// Process QR payment
export const processQRPayment = async (paymentData) => {
  try {
    const response = await axios.post(`${API_URL}/payments/qr`, paymentData);
    return response.data;
  } catch (error) {
    console.error("Error processing QR payment:", error);
    throw error;
  }
};

// Get all payments with filters
export const getAllPayments = async (filters = {}) => {
  try {
    const queryParams = new URLSearchParams(filters).toString();
    const response = await axios.get(`${API_URL}/payments?${queryParams}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error;
  }
};

export default Api;
