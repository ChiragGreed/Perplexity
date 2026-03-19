import 'dotenv/config.js';
import app from './src/app.js';
import connectDB from './src/config/database.js';
import { useAi } from './src/services/ai.service.js';


const PORT = process.env.PORT || 5000;

await connectDB();


useAi();


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
