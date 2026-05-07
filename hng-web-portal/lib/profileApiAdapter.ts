import axios from "axios";
import refreshToken from "./refreshToken";

const config = {
  baseURL: process.env.NEXT_PUBLIC_PROFILE_API_URL,
  timeout: 30000,
};

const profileApiAdapter = axios.create(config);

profileApiAdapter.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("access_token");
    console.log(accessToken);
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    config.headers["X-API-Version"] = 1;
    return config;
  },
  (err) => Promise.reject(err),
);

profileApiAdapter.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return profileApiAdapter(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);

export default profileApiAdapter;
