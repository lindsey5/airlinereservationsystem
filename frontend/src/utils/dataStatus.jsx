
export const dataStatus = (status) => {
    if (status === 'Available' || status === 'Completed') {
        return <td><p className='green-td'>{status}</p></td>;
    } else if (status === 'Assigned' || status === 'Scheduled' || status === 'In-Flight') {
        return <td><p className='blue-td'>{status}</p></td>;
    } else {
        return <td><p className='red-td'>{status}</p></td>;
    }
}