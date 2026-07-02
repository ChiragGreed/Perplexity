import { useDispatch } from 'react-redux';
import { getMeApi, loginApi } from '../Services/authApi.js'
import { setError, setLoading, setUser } from '../Store/authSlice.js';

const useAuth = () => {

    const dispatch = useDispatch();

    const registerHandler = async (username, email, password) => {
        try {
            dispatch(setLoading(true));
            const resData = await registerApi(email, password);
        }
        catch (error) {
            dispatch(setError(error.message));
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    const loginHandler = async (email, password) => {
        try {
            dispatch(setLoading(true));
            const resData = await loginApi(email, password);
            dispatch(setUser(resData.user));
            return true;
        }
        catch (error) {
            dispatch(setError(error.message));
            return false;
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    const getMeHandler = async () => {
        try {
            dispatch(setLoading(true));
            const resData = await getMeApi();
            dispatch(setUser(resData.user));
        }
        catch (error) {
            dispatch(setError(error.message))
        }
        finally {
            dispatch(setLoading(false));
        }
    }

    return { registerHandler, loginHandler, getMeHandler }
}

export default useAuth;