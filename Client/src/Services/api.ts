import axios from "axios";
import { useConfig } from "../Context/configContext";

export const useApi = () => {
  const config = useConfig(); 
  const API_BASE_URL = config.REACT_APP_SERVER_URL;

  const userTokenGenerate = (data: { username: string; password: string }) => {
    return axios.post(`${API_BASE_URL}/login`, data);
  };

  const resetEntitySecret = (entityId: string, token: string) => {
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    return axios.post(`${API_BASE_URL}/entity/secret/reset`, { entityId }, { headers });
  };

  const readEntitySecret = (entityId: string, token: string) => {
    const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };
    return axios.post(`${API_BASE_URL}/entity/secret/read`, { entityId }, { headers });
  };

  const resetPassword = async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/user/password/reset`, { email });
      return response.data;
    } catch (error) {
      throw new Error("Failed to send password reset email");
    }
  };

  const fetchTokenData = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/token/data/query`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  const fetchSecretExpiryData = async () => {
    try {
      const response = await axios.post(`${API_BASE_URL}/secret/expiry/query`, {});
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  return {
    userTokenGenerate,
    resetEntitySecret,
    readEntitySecret,
    resetPassword,
    fetchTokenData,
    fetchSecretExpiryData,
  };
};
