export const formatDate = (dateString) => {
    const date = new Date(dateString);
    // Custom format (MM-DD-YYYY HH:mm:ss)
    const formattedDate = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
      
      // Manipulate the string to match the format 'MM-DD-YYYY (hh:mmAM/PM)'
      const finalFormattedDate = formattedDate.replace(',', '').replace(' ', ' (');
      const result = finalFormattedDate + ')';
      return result
}

export const formatDateOnly = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
      });
    return formattedDate
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

export const formatDate2 = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-based
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

