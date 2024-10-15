import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_TOKEN_SERVICE_URL;

interface UserTokenGeneratePayload {
  username: string;
  password: string;
}


export const userTokenGenerate = (data: UserTokenGeneratePayload) => {
  return axios.post(`${API_BASE_URL}/login`, data);
};

export const resetEntitySecret = (entityId: string, token: string) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, 
  };

  return axios.post(`${API_BASE_URL}/entity/secret/reset`, { entityId }, { headers });
};


export const readEntitySecret = (entityId: string, token: string) => {
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`, 
  };

  return axios.post(`${API_BASE_URL}/entity/secret/read`, { entityId }, { headers });
};