import express from 'express';
import cors from 'cors';
import connectDB from './config/db'; 
import router from './routes/index'; 
import { PORT } from './config/env';
import { DB } from './config/env' 

connectDB();
const app = express();

app.use(cors());
app.use(express.json());
app.use(router);

app.listen(PORT, (err?: Error) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`The server started on http://localhost:${PORT} \nMONGO: ${DB}`);
    }
});