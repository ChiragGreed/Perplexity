import path from 'path';
import { fileURLToPath } from 'url';

export const publicRouteController = (req, res) => {

    const filepath = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(filepath);

    const filePath = path.join(__dirname, '../', '../', '/public/dist/index.html');

    res.sendFile(filePath);
}