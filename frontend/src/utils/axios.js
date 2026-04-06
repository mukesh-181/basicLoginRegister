import axios from "axios";

axios.defaults.baseURL = "http://localhost:4000/api";
axios.defaults.withCredentials = true;

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const status = error.response?.status;
    const message = String(error.response?.data?.message || "").toLowerCase();

    if (
      status &&
      [401, 403].includes(status) &&
      !originalRequest._retry &&
      originalRequest.url !== "/user/refresh-token" &&
      (message.includes("token") || message.includes("session"))
    ) {
      originalRequest._retry = true;

      try {
        await axios.post("/user/refresh-token");
        return axios(originalRequest);
      } catch (err) {
        return Promise.reject(err);
      }
    }

    if (error.response) {
      error.status = status;
    }

    return Promise.reject(error);
  }
);

export default axios;