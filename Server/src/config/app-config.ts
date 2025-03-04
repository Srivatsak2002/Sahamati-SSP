import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export const appConfig = {
  // Server-only (private) variables
  PORT: process.env.PORT || '3001',
  REACT_APP_TOKEN_SERVICE_URL: process.env.REACT_APP_TOKEN_SERVICE_URL || 'https://4.224.11.119.sslip.io/iam/v1',
  SAHAMATI_USERNAME: process.env.SAHAMATI_USERNAME || '',
  SAHAMATI_PASSWORD: process.env.SAHAMATI_PASSWORD || '',
  SAHAMATI_CLIENT_ID: process.env.SAHAMATI_CLIENT_ID || 'sahamati-admins',
  SAHAMATI_CLIENT_SECRET: process.env.SAHAMATI_CLIENT_SECRET || '',
  KEYCLOAK_URL: process.env.KEYCLOAK_URL || 'https://4.188.114.90.sslip.io/auth/realms/sahamati/protocol/openid-connect/token',
  REACT_APP_TOKEN_DATA_QUERY_URL: process.env.REACT_APP_TOKEN_DATA_QUERY_URL || 'http://localhost:3000',
  REACT_APP_SECRET_EXPIRY_DATA_QUERY_URL: process.env.REACT_APP_SECRET_EXPIRY_DATA_QUERY_URL || 'http://localhost:9000',
  
  // Client-safe variables (exposed via API)
  CLIENT_CONFIG: {
    REACT_APP_SERVER_URL: process.env.REACT_APP_SERVER_URL || '',
    REACT_APP_DASHBOARD_URL: process.env.REACT_APP_DASHBOARD_URL || '',
    REACT_APP_SELF_SERVICE_PORTAL_ENABLED: process.env.REACT_APP_SELF_SERVICE_PORTAL_ENABLED === 'true',
    REACT_APP_DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE: process.env.REACT_APP_DISPLAY_ENTITIES_WITHOUT_EXPIRYDATE === 'true',  
  }
};
