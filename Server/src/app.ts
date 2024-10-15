// src/app.ts
import express, { Request, Response } from 'express';
import axios from 'axios';
import dotenv from 'dotenv'; 
import logger from './utils/logger';

dotenv.config(); 

const app = express();

app.use(express.json());

const API_BASE_URL = process.env.REACT_APP_TOKEN_SERVICE_URL 
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
        logger.error('Error logging in'); 
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
        logger.error('Error resetting entity secret');
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
        logger.error('Error reading entity secret');
        res.status(500).json({ message: 'Failed to read entity secret.' });
    }
});
export default app;
