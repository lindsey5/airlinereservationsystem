import { Outlet } from "react-router-dom"
import HomeHeader from "../Pages/HomePage/HomeHeader"

export default function HomeLayout() {
    return(
        <main className="home-layout">
            <HomeHeader />
            <Outlet />
        </main>
    )

}