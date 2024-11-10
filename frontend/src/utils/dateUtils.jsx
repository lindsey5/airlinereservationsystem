export const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().split('T')[0];
    const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${formattedDate} (${time})`;
}

export const formatToLongDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC'
      })
}

export const getTime = (dateString) => {
    const date = new Date(dateString);
    
    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    const period = hours >= 12 ? 'PM' : 'AM';
    
    // Convert hours to 12-hour format
    hours = hours % 12 || 12;  // If hours == 0, it will convert to 12 (12 AM)
    
    // Format the time as "hh:mm AM/PM"
    const formattedTime = `${String(hours).padStart(2, '0')}:${minutes} ${period}`;
    
    return formattedTime;
};
