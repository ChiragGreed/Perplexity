import 'dotenv/config.js';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { createServer } from 'http';
import initializeSocketio from './src/services/socket.service.js';


const PORT = process.env.PORT || 5000;

const httpServer = createServer(app);

initializeSocketio(httpServer);

await connectDB();

httpServer.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
