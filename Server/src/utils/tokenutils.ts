import axios from 'axios';
import { appConfig } from '../config/app-config';

export const generateToken = async () => {
  try {
    const formData = new URLSearchParams();
    formData.append('grant_type', 'password');
    formData.append('username', appConfig.SAHAMATI_USERNAME);
    formData.append('password', appConfig.SAHAMATI_PASSWORD);
    formData.append('client_id', appConfig.SAHAMATI_CLIENT_ID);
    formData.append('client_secret', appConfig.SAHAMATI_CLIENT_SECRET);

    const response = await axios.post(appConfig.TOKEN_URL, formData.toString(), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    return response.data.access_token; 
  } catch (error) {
    console.error('Error generating token:', error);
    throw new Error('Failed to generate token');
  }
};
