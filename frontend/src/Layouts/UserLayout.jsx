import { Outlet } from "react-router-dom"
import UserHeader from "../Components/User/Partials/UserHeader"
import ChatBotInterface from "../Pages/UserPage/ChatBotInterface"

export default function UserLayout() {
    return(
        <main className="user-page">
                <UserHeader />
                <Outlet />
                <ChatBotInterface />
        </main>
    )
}