import { Outlet } from "react-router-dom"
import FrontDeskHeader from "../Components/FrontDesk/partials/FrontDeskHeader"
import FrontDeskSideBar from "../Components/FrontDesk/partials/FrontDeskSidebar"

export default function FrontDeskLayout() {
    return(
        <main>
            <FrontDeskHeader/>
            <FrontDeskSideBar />
            <Outlet />
        </main>
    )

}