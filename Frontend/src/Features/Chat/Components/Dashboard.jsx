import { useEffect } from "react"
import useChat from "../Hooks/useChat";

const Dashboard = () => {

    const { socketConnectionHandler } = useChat();

    useEffect(() => {
        const services = socketConnectionHandler();
        services();
    }, [])

    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    )
}

export default Dashboard
