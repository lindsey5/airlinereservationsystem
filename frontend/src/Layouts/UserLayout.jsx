import { Outlet } from "react-router-dom"
import UserHeader from "../Components/User/Partials/UserHeader"
import { SearchContextProvider } from "../Context/SearchContext"


export default function UserLayout() {
    return(
        <main className="user-page">
                <UserHeader />
                <Outlet />
        </main>
    )
}