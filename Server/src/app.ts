import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv'; 
import logger from './utils/logger';
import { generateToken } from './utils/tokenutils';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { appConfig } from './config/app-config';

dotenv.config(); 

const app = express();

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5174', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true
}));
app.use(helmet()); 
app.use(express.urlencoded({ extended: true })); 
app.use(morgan('combined', { stream: { write: msg => logger.info(msg.trim()) } })); 
app.options('*', cors());

const API_BASE_URL = appConfig.REACT_APP_TOKEN_SERVICE_URL;
logger.info("API Base URL: ", API_BASE_URL);

if (!API_BASE_URL) {
    logger.error('API_BASE_URL is not defined. Please check your .env file.');
    process.exit(1);
}



app.post('/api/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    try {
        const formData = new URLSearchParams();
        formData.append('username', username);
        formData.append('password', password);

        const response = await axios.post(`${API_BASE_URL}/user/token/generate`, formData.toString(), {
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
        });

        res.json(response.data); 
    } catch (error) {
        logger.error('Error logging in:', error); 
        res.status(500).json({ message: 'Login failed. Please check your credentials.' });
    }
});

app.post('/api/entity/secret/reset', async (req: Request, res: Response) => {
    const { entityId } = req.body; 
    const token = req.headers.authorization?.split(" ")[1]; 

    try {
        const headers = {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}`
        };

        const response = await axios.post(`${API_BASE_URL}/entity/secret/reset`, { entityId }, { headers });
        res.json(response.data); 
    } catch (error) {
        logger.error('Error resetting entity secret:', error);
        res.status(500).json({ message: 'Failed to reset entity secret.' });
    }
});

app.post('/api/entity/secret/read', async (req: Request, res: Response) => {
    const { entityId } = req.body; 
    const token = req.headers.authorization?.split(" ")[1]; 

    try {
        const headers = {
            "Content-Type": "application/json", 
            "Authorization": `Bearer ${token}` 
        };

        const response = await axios.post(`${API_BASE_URL}/entity/secret/read`, { entityId }, { headers });
        res.json(response.data); 
    } catch (error) {
        logger.error('Error reading entity secret:', error);
        res.status(500).json({ message: 'Failed to read entity secret.' });
    }
});

app.post('/api/user/password/reset', async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const token = await generateToken(); 

        const headers = {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        };

        const response = await axios.post(`${API_BASE_URL}/user/password/reset`, { email }, { headers });

        res.json(response.data);
    } catch (error) {
        logger.error('Error resetting password:', error);
        res.status(500).json({ message: 'Failed to reset password.' });
    }
});

app.use(express.static(path.join(__dirname, '../../Client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Client/build/index.html'));
});

export default app;
