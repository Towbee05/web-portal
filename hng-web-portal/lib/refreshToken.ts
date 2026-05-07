import axios from "axios";

const refreshToken = async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/refresh`,
    {
      refresh_token: refreshToken,
    },
  );
  const data = response.data;

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);

  return data.access_token;
};

export default refreshToken;
