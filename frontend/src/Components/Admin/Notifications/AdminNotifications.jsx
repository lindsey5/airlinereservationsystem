import './AdminNotifications.css'

const AdminNotifications = ({notifications, setNotifications, setFlightData}) => {
    
    const closeNotification = (index) => {
        setNotifications(notifications.filter((notif, i) => i!==index));
    }

    const handleClick = (index, flight) => {
        setFlightData(flight);
    }
    
    return(
        <div className="notifications">
        {notifications && notifications.map((notification, i) => 
            <div className="notification" key={i} onClick={() => handleClick(i, notification.flight)}>
                <span onClick={() => closeNotification(i)}>X</span>
                <img src="/icons/bell.png" alt="" />
                <p>{notification.message}</p>
            </div>
        )}
        </div>
    )
}

export default AdminNotifications