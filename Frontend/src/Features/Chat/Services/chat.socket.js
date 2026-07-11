import { io } from 'socket.io-client';
import { AddAiResChunks } from '../State/chatSlice';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';

export let socket;

const useSocketIoService = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        socket = io('http://localhost:7000', {
            withCredentials: true
        });

        socket.on('connect', () => {
            console.log('Connected to server');
        })

        socket.on('ResponseChunk', (chunk) => {
            dispatch(AddAiResChunks(chunk));
        })

        return () => {
            socket.disconnect();
        }
    }, [dispatch]);
}

export default useSocketIoService