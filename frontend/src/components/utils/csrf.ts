import axiosInstance from "./axiosInstance";

export const getCsrfToken = async () => {
  try {
    const response = await axiosInstance.get("/csrf-token");
    axiosInstance.defaults.headers.common["X-CSRF-TOKEN"] = response.data.csrf_token;
  } catch (error) {
    console.error("Error fetching CSRF token: ", error);
  }
};
