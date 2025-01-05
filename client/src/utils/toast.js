import { toast } from "react-toastify";

// Default toast configuration
const defaultConfig = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, defaultConfig);
  },
  error: (message) => {
    toast.error(message || "An error occurred", defaultConfig);
  },
  warning: (message) => {
    toast.warning(message, defaultConfig);
  },
  info: (message) => {
    toast.info(message, defaultConfig);
  },
};

// Helper function to handle API errors
export const handleApiError = (error) => {
  const errorMessage =
    error.response?.data?.message || error.message || "An error occurred";
  showToast.error(errorMessage);
  return errorMessage;
};
