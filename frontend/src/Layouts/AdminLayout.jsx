import { Outlet } from "react-router-dom"
import AdminSideBar from "../Components/Admin/Partials/AdminSideBar"
import AdminHeader from "../Components/Admin/Partials/AdminHeader"

export default function AdminLayout() {
    return(
        <main>
                <AdminHeader />
                <AdminSideBar />
                <Outlet />
        </main>
    )

}