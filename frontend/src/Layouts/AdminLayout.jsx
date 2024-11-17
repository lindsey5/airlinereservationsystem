import { Outlet } from "react-router-dom"
import AdminSideBar from "../Components/Admin/Partials/AdminSideBar"
import AdminHeader from "../Components/Admin/Partials/AdminHeader"
import { SearchContextProvider } from "../Context/SearchContext"


export default function AdminLayout() {
    return(
        <main>
            <SearchContextProvider>
                <AdminHeader />
                <AdminSideBar />
                <Outlet />
            </SearchContextProvider>
        </main>
    )

}