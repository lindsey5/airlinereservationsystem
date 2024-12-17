import { Outlet } from "react-router-dom"
import AdminSideBar from "../Components/Admin/Partials/AdminSideBar"
import AdminHeader from "../Components/Admin/Partials/AdminHeader"
import { useEffect, useState } from "react";
import io from 'socket.io-client';
import AdminNotifications from "../Components/Admin/Notifications/AdminNotifications";
import FlightDetailsModal from "../Components/Modals/FlightDetailsModal";

const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3000';

export default function AdminLayout() {
    const [notifications, setNotifications] = useState([]);
    const [flightData, setFlightData] = useState();

    useEffect(() => {
        const socket = io(URL);

        socket.on('notification', (value) => {
            setNotifications(prev => [...prev, value]);
        })

        return () => {
            socket.off('notification');
        }
        
    }, []);

    return(
        <main>
            {flightData && <FlightDetailsModal flightData={flightData} close={() => setFlightData() }/>}
            <AdminHeader />
            <AdminSideBar />
            <Outlet />
            <AdminNotifications notifications={notifications} setNotifications={setNotifications} setFlightData={setFlightData}/>
        </main>
    )

}