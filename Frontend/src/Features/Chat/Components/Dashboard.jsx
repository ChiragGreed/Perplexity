import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router';
import useAuth from '../../Auth/Hooks/useAuth';

const Dashboard = () => {

    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.user);
    const navigate = useNavigate();
    const { getMeHandler } = useAuth();


    useEffect(() => {
        async function getMe() {
            await getMeHandler();
        }
        getMe();
    }, [])



    if (loading) return
    <div>
        <h1>Loading</h1>
    </div>


    if (!user) {
        navigate('/login')
    }


    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard
