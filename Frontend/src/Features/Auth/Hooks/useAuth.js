import { useDispatch } from 'react-redux';
import { getMeApi, loginApi, registerAPi } from '../Services/authApi.js';
import { setError, setLoading, setUser } from '../State/authSlice.js';

const useAuth = () => {

    const dispatch = useDispatch();

    const registerHandler = async (username, email, password) => {
        try {
            dispatch(setLoading(true));
            const resData = await registerAPi(username, email, password);
            return { success: true, message: resData.message };
        }
        catch (error) {
            dispatch(setError(error.message));
            return { success: false, error: error.response?.data?.message || error.message };
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
            return { success: true, message: resData.message };

        }
        catch (error) {
            dispatch(setError(error.message));
            return { success: false, error: error.response?.data?.message || error.message };
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