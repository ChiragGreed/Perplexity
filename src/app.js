import express from 'express';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import chatRoute from './routes/chatRoute.js';


const app = express();

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoute);
app.use('/api/chats', chatRoute);


export default app;
