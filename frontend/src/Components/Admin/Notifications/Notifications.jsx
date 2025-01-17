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

            socket.on('notification', () => {
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
            if (notifRef.current && 
                !notifRef.current.contains(event.target) && 
                showNotifs && 
                event.target.classList.value !== 'show-more-btn') {
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

    const handleDelete = async () => {
        if(confirm('Delete all notifications?')){
            await socket.emit('delete-notifications');
            await socket.emit('notifications', {limit});
        }
    }

    return (
        <div className="notifications" ref={notifRef}>
            <button onClick={async() => {
                if(showNotifs)  socket.emit('notifications', {limit});
                await socket.emit('update-notifications');
                setShowNotifs(prev => !prev);
                setLimit(10);
            }}>
                <img src="/icons/bell.png" alt="" />
            </button>
            {notifications?.deliveredNotifications > 0 && <span>{notifications.deliveredNotifications}</span>}
            {showNotifs && 
            <div className='notifications-parent-container'>
            <div>
            <h2>Notifications</h2>
            {notifications?.notifications.length > 0 && <button 
                className='delete-btn'
                onClick={handleDelete}
            >
                Delete All
            </button>}
            </div>
            <div className='notifications-container'>
                {notifications?.notifications && notifications?.notifications.map(notification => 
                <div 
                    onClick={() => {
                        setFlightData(notification.flight)
                        setShowNotifs(false)
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
            {notifications.total >= limit && 
            <button 
                className='show-more-btn' 
                onClick={handleShowMoreClick}>
                Show More</button>}
            </div>}
        </div>
    )

}

export default Notifications 