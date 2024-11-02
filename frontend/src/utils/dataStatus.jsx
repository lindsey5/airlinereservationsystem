
export const dataStatus = (status) => {
    if (status === 'Available' || status === 'Scheduled') {
        return <td><p className='green-td'>{status}</p></td>;
    } else if (status === 'In Flight') {
        return <td><p className='blue-td'>{status}</p></td>;
    } else {
        return <td><p className='red-td'>{status}</p></td>;
    }
}