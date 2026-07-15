import express from 'express';
import authRoute from './routes/authRoute.js';
import cookieParser from 'cookie-parser';
import chatRoute from './routes/chatRoute.js';
import cors from 'cors';
import path from 'path';
import publicRoute from './routes/publicRoute.js';
import { fileURLToPath } from 'url';

const app = express();

const filepath = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filepath);

app.use(express.json());

app.use(express.static(path.join(__dirname, '../', '/public/dist')));

app.use(cookieParser());
app.use(cors({
    origin: 'https://askbase-qv8j.onrender.com',
    credentials: true
}));

app.use('/api/auth', authRoute);
app.use('/api/chat', chatRoute);

app.use('/', publicRoute);


export default app;
