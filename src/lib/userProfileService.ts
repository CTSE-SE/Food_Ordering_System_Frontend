import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://shopapp-alb-1013507396.ap-southeast-1.elb.amazonaws.com";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`,
  };
};

export const getUserProfile = async () => {
  const response = await axios.get(`${API_BASE_URL}/api/users/profile`, {
    headers: getAuthHeaders(),
  });

  return response.data;
};

export const updateUserProfile = async (payload: {
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
}) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/users/profile`,
    payload,
    {
      headers: getAuthHeaders(),
    }
  );

  return response.data;
};