import { useEffect } from "react";
import useAuth from "../Hooks/useAuth";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

const Protected = ({ children }) => {

    const loading = useSelector((state) => state.auth.loading);
    const user = useSelector((state) => state.auth.user);
    const { getMeHandler } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        async function getMe() {
            await getMeHandler();
        }
        getMe();
    }, [])


    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user]);

    if (loading) {
        return (
            <div>
                <h1>Loading...</h1>
            </div>
        );
    }

    return (
        <>
            {children}
        </>
    )
}

export default Protected