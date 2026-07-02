import React, { useState } from 'react';
import useAuth from '../Hooks/useAuth.js'
import { useNavigate } from 'react-router';

const Login = () => {

    const { loginHandler } = useAuth();
    const navigate = useNavigate();
    const [Email, setEmail] = useState('');
    const [Password, setPassword] = useState('');

    async function submitHandler(e) {
        e.preventDefault();
        const res = await loginHandler(Email, Password);
        if (res) navigate('/');
    }


    return (
        <div>
            <form className='flex flex-col gap-4 text-2xl' onSubmit={(e) => submitHandler(e)}>
                <input className="bg-amber-500 border-blue-300 border-4" onChange={(e) => setEmail(e.target.value)} name="email" value={Email} type="text" placeholder='email'></input>
                <input className="bg-amber-500 border-blue-300 border-4" onChange={(e) => setPassword(e.target.value)} name="password" value={Password} type="text" placeholder='password'></input>
                <button className='bg-green-500'>Submit</button>
            </form >
        </div >
    )
}

export default Login
