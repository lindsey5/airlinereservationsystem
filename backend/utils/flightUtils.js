export const validateColumns = (columns) => {
    const regex = /^(\d+x)+\d+$/;
    return regex.test(columns);
};


export const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        if(classObj){
            totalSeats += parseInt(classObj.seats);
        }
    });
    
    return totalSeats
}
//This function generateSeats with seathNumber based on total seats and columns of the airplane
export const createSeats = (totalSeats, columns) => {
    const totalColumns = columns.split('x').map(column => parseInt(column, 10));
    const sumOfColumns = totalColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    const newSeats = [];
    let num = 1;
    for(let i = 0; i < totalSeats / sumOfColumns; i++){
        for(let j = 0; j < sumOfColumns; j++){
            const letter = String.fromCharCode(65 + j);
            newSeats.push({
                    seatNumber: `${letter}${num}`,
            });
        }
        num++;
    }
    return newSeats;
};

// This function generate flight classes
export const createClasses = (classes, seats) => {
    let offset = 0;
    const newClasses = classes.map(classObj => {
        const classSeats = [];
        for(let i=0; i <classObj.seats; i++){
            classSeats.push(seats[offset]);
            offset++;
        }
        return {
            className: classObj.className,
            price: classObj.price,
            seats: classSeats,
        }
    })
    return newClasses;
}