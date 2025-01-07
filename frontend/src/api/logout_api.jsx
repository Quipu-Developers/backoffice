import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;
const FRONTEND_URL = process.env.REACT_APP_FRONTEND_URL;

export const logout = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bo/auth/logout`, {
      headers: {
        accept: "application/json",
        Origin: FRONTEND_URL,
      },
      withCredentials: true,
    });
    return response;
  } catch (err) {
    console.error("Error logging out:", err);
    throw err;
  }
};
