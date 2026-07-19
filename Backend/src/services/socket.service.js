import { Server } from 'socket.io';

export let io;

const initializeSocketio = (httpServer) => {

    io = new Server(httpServer, {
        cors: {
            origin: 'https://askbase-qv8j.onrender.com',
            credentials: true
        }
    })
    console.log("Socket io is running");

    io.on('connection', (socket) => {
        console.log(`${socket.id} Connected`);

        socket.on('message', (message) => {
            console.log(message);
        })
    })
}

export default initializeSocketio;