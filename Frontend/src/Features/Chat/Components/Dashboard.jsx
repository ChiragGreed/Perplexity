import Protected from "../../Auth/Components/Protected"

const Dashboard = () => {

    return (
        <Protected>
            <div>
                <h1>Dashboard</h1>
            </div>
        </Protected>
    )
}

export default Dashboard
