import { io } from 'socket.io-client';

const socketIoService = () => {

    const socket = io('http://localhost:7000', {
        withCredentials: true
    });

    socket.on('connect', () => {
        console.log('Connected to server');
    })
}

export default socketIoService