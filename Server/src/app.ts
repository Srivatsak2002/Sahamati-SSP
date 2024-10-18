import express from 'express';
import dotenv from 'dotenv'; 
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import logger from './utils/logger';
import apiRoutes from './routes/apiRoutes';

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

app.use('/api', apiRoutes);

app.use(express.static(path.join(__dirname, '../../Client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../Client/build/index.html'));
});

export default app;
