import dotenv from 'dotenv';

dotenv.config();

export const appConfig = {

  PORT: process.env.PORT || '3001',  
  REACT_APP_TOKEN_SERVICE_URL: process.env.REACT_APP_TOKEN_SERVICE_URL || 'https://api.sandbox.sahamati.org.in/iam/v1',
  SAHAMATI_USERNAME: process.env.SAHAMATI_USERNAME || '',
  SAHAMATI_PASSWORD: process.env.SAHAMATI_PASSWORD || '',
  SAHAMATI_CLIENT_ID: process.env.SAHAMATI_CLIENT_ID || 'sahamati-admins',
  SAHAMATI_CLIENT_SECRET: process.env.SAHAMATI_CLIENT_SECRET || '',
  TOKEN_URL: process.env.TOKEN_URL || 'https://tokens.sandbox.sahamati.org.in/auth/realms/sahamati/protocol/openid-connect/token',
};
