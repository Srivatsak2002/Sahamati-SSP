import { Router, Request, Response } from "express";
import axios from "axios";
import logger from "../utils/logger";
import { generateToken } from "../utils/tokenutils";
import { appConfig } from "../config/app-config";

const router = Router();
const API_BASE_URL = appConfig.REACT_APP_TOKEN_SERVICE_URL;
const TOKEN_DATA_QUERY_URL = appConfig.REACT_APP_TOKEN_DATA_QUERY_URL;
const SECRET_EXPIRY_DATA_QUERY_URL =
  appConfig.REACT_APP_SECRET_EXPIRY_DATA_QUERY_URL;
if (!API_BASE_URL) {
  logger.error("API_BASE_URL is not defined. Please check your .env file.");
  process.exit(1);
}

router.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await axios.post(
      `${API_BASE_URL}/user/token/generate`,
      formData.toString(),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      }
    );

    res.json(response.data);
  } catch (error) {
    logger.error("Error logging in:", error);
    res
      .status(500)
      .json({ message: "Login failed. Please check your credentials." });
  }
});

router.post("/entity/secret/reset", async (req: Request, res: Response) => {
  const { entityId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/entity/secret/reset`,
      { entityId },
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    logger.error("Error resetting entity secret:", error);
    res.status(500).json({ message: "Failed to reset entity secret." });
  }
});

router.post("/entity/secret/read", async (req: Request, res: Response) => {
  const { entityId } = req.body;
  const token = req.headers.authorization?.split(" ")[1];

  try {
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/entity/secret/read`,
      { entityId },
      { headers }
    );
    res.json(response.data);
  } catch (error) {
    logger.error("Error reading entity secret:", error);
    res.status(500).json({ message: "Failed to read entity secret." });
  }
});

router.post("/user/password/reset", async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const token = await generateToken();

    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    const response = await axios.post(
      `${API_BASE_URL}/user/password/reset`,
      { email },
      { headers }
    );

    res.json(response.data);
  } catch (error) {
    logger.error("Error resetting password:", error);
    res.status(500).json({ message: "Failed to reset password." });
  }
});

router.post("/token/data/query", async (req: Request, res: Response) => {
  try {
    const requestBody = {
      id: "api.data.out",
      ver: "v2",
      ts: "1711966306164",
      params: { msgid: "e180ecac-8f41-4f21-9a21-0b3a1a368917" },
      context: { aggregationLevel: "hour" },
      query: `SELECT TIME_FLOOR(CAST("__time" AS TIMESTAMP), 'P1D') AS "__time", 
                COALESCE(LOOKUP("edata.attributes.sender.id", 'entity_name'), '') AS "entity_name", 
                "edata.attributes.sender.id" AS "entity_id", 
                COUNT(*) AS "tokens_issued" 
                FROM "iam-api-telemetry" 
                WHERE "edata.attributes.request.url" IN ('/entity/token/generate') 
                AND "edata.status" = 'Ok' 
                GROUP BY TIME_FLOOR(CAST("__time" AS TIMESTAMP), 'P1D'), 
                COALESCE(LOOKUP("edata.attributes.sender.id", 'entity_name'), ''), 
                "edata.attributes.sender.id" 
                ORDER BY "tokens_issued" DESC`,
    };

    const response = await axios.post(
      `${TOKEN_DATA_QUERY_URL}/v2/data/query/iam-api-telemetry`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data?.result || []);
  } catch (error) {
    logger.error("Error fetching data:", error);
    res.status(500).json({ message: "Failed to fetch data." });
  }
});

router.post("/secret/expiry/query", async (req: Request, res: Response) => {
  try {
    
    const headers = {
      "Content-Type": "application/json",
      //   Authorization: `Bearer ${token}`,
    };

    const requestBody = {
      txnId: "test-txn-id",
      limit: 5,
      offset: 0,
      filters: {},
    };

    const response = await axios.post(
      `${SECRET_EXPIRY_DATA_QUERY_URL}/private/entity/list`,
      requestBody,
      { headers }
    );

    res.json(response.data.entities || []);
  } catch (error) {
    logger.error("Error fetching secret expiry data:", error);
    res.status(500).json({ message: "Failed to fetch secret expiry data." });
  }
});

router.get("/config", (_req, res) => {
  res.json(appConfig.CLIENT_CONFIG);
});

export default router;
