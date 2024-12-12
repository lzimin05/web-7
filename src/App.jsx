import RequestCard from "./RequestCard"
import "./styles.scss"

export default function App() {
    return (
        <div className="requests">
            <RequestCard method="GET" url="localhost:8082" />
            <RequestCard method="GET" url="localhost:8083/api/user" query={["name"]} />
            <RequestCard method="GET" url="localhost:8081/count" />
            <RequestCard method="POST" url="localhost:8081/count" body={["count"]} />
        </div>
    )
}
