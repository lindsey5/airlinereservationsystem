import { useEffect, useState } from 'react'
import './Notifications.css'
import { formatDate } from '../../../utils/dateUtils';


const Notifications = ({socket, setFlightData}) => {
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [limit, setLimit] = useState(10);

    useEffect(() => {
        if(socket){
            socket.emit('notifications', {limit})

            socket.on('notifications', (value) => {
                setNotifications(value);
            })

            socket.on('notification', (value) => {
                socket.emit('notifications', {limit});
            })
        }
    }, [socket])

    const handleShowMoreClick = () => {
        setLimit(prev => prev + 5)
    }

    useEffect(() => {
        if(socket){
            socket.emit('notifications', {limit})
        }
    }, [limit])

    useEffect(() => {
        console.log(notifications)
    }, [notifications])

    return (
        <div className="notifications">
            <button onClick={() => {
                setShowNotifs(prev => !prev);
                socket.emit('update-notifications');
                socket.emit('notifications', {limit});
            }}>
                <img src="/icons/bell.png" alt="" />
            </button>
            {notifications.filter(notification => notification.status === 'Delivered').length !== 0 && <span>{notifications.filter(notification => notification.status === 'Delivered').length}</span>}
            {showNotifs && 
            <div className='notifications-parent-container'>
            <h2>Notifications</h2>
            <div className='notifications-container'>
                {notifications.map(notification => 
                <div 
                    onClick={() => setFlightData(notification.flight)}
                    key={notification._id} 
                    className={`notification ${notification.status === 'Delivered' ? 'delivered' : ''}`}
                >
                    <img src="/icons/bell.png" alt="" />
                    <div>
                    <p>{notification.message}</p>
                    <p>{formatDate(notification.createdAt)}</p>
                    </div>
                </div>)}
            </div>
            <button className='show-more-btn' onClick={handleShowMoreClick}>Show More</button>
            </div>}
        </div>
    )

}

export default Notifications 