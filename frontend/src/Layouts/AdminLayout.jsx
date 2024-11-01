import { Outlet } from "react-router-dom"
import AdminSideBar from "../Components/Admin/AdminSideBar"
import AdminHeader from "../Components/Admin/AdminHeader"


export default function AdminLayout() {
    return(
        <main>
            <AdminHeader />
            <AdminSideBar />
            <Outlet />
        </main>
    )

}