import { useEffect, useRef, useState } from 'react'
import './Notifications.css'
import { formatDate } from '../../../utils/dateUtils';


const Notifications = ({socket, setFlightData}) => {
    const [showNotifs, setShowNotifs] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [limit, setLimit] = useState(10);
    const notifRef = useRef();

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
        const handleClickOutside = (event) => {
            if (notifRef.current && !notifRef.current.contains(event.target) && event.target.classList === 'show-more-btn' && showNotifs) {
                setShowNotifs(false)
            }
        };

        // Add event listener on mount
        document.addEventListener('click', handleClickOutside);

        // Cleanup event listener on unmount
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showNotifs]);

    return (
        <div className="notifications" ref={notifRef}>
            <button onClick={() => {
                setShowNotifs(prev => !prev);
                setLimit(10);
            }}>
                <img src="/icons/bell.png" alt="" />
            </button>
            {notifications?.deliveredNotifications > 0 && <span>{notifications.deliveredNotifications}</span>}
            {showNotifs && 
            <div className='notifications-parent-container'>
            <h2>Notifications</h2>
            <div className='notifications-container'>
                {notifications?.notifications.map(notification => 
                <div 
                    onClick={() => {
                        socket.emit('update-notification', {id: notification._id});
                        socket.emit('notifications', {limit});
                        setFlightData(notification.flight)
                    }}
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
            {notifications.total >= limit && <button className='show-more-btn' onClick={handleShowMoreClick}>Show More</button>}
            </div>}
        </div>
    )

}

export default Notifications 