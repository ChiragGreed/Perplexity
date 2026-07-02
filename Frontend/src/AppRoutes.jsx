import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./Features/Auth/Components/Register.jsx";
import Dashboard from "./Features/Chat/Components/Dashboard.jsx";
import App from "./App.jsx";
import Login from "./Features/Auth/Components/Login.jsx";

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