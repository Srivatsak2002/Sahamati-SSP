import app from './app'; 
import dotenv from 'dotenv'; 
import { appConfig } from './config/app-config';

dotenv.config(); 

const port = appConfig.PORT;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
