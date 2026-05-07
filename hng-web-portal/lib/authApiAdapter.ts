import axios from "axios";

const config = {
  baseURL: process.env.NEXT_PUBLIC_AUTH_API_URL,
  timeout: 30000,
};

const authApiAdapter = axios.create(config);
export default authApiAdapter;
