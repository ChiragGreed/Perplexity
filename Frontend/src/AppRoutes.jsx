import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Features/Auth/Pages/Register.jsx";
import Login from "./Features/Auth/Pages/Login.jsx";
import App from "./App.jsx";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/' element={<App />} />
                <Route path='/login' element={<Login />} />
                <Route path='/register' element={<Register />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRoutes  