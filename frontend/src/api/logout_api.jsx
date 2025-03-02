import axios from "axios";

const BASE_URL = process.env.REACT_APP_BACKEND_URL;

export const logout = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/bo/auth/logout`, {
      headers: {
        accept: "application/json",
      },
      withCredentials: true,
    });
    return response;
  } catch (err) {
    console.error("Error logout:", err);
    throw err;
  }
};
