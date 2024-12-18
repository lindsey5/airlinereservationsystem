import { Outlet } from "react-router-dom"
import AdminSideBar from "../Components/Admin/Partials/AdminSideBar"
import AdminHeader from "../Components/Admin/Partials/AdminHeader"
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import FlightDetailsModal from "../Components/Modals/FlightDetailsModal";
import PopUp from "../Components/Admin/Notifications/PopUp";

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export default function AdminLayout() {
    const [flightData, setFlightData] = useState();
    const [socket, setSocket] = useState();

    useEffect(() => {
        const socket = io(URL);
        setSocket(socket);
    }, []);

    return(
        <main>
            {flightData && <FlightDetailsModal flightData={flightData} close={() => setFlightData() }/>}
            <AdminHeader socket={socket} setFlightData={setFlightData}/>
            <AdminSideBar />
            <Outlet />
            <PopUp socket={socket} setFlightData={setFlightData}/>
        </main>
    )

}