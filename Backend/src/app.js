import express from 'express';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import chatRoute from './routes/chatRoute.js';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);


export default app;
