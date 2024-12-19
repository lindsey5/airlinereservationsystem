export const calculateSeats = (classes) => {
    let totalSeats = 0;

    classes.forEach(classObj => {
        if(classObj){
            totalSeats += parseInt(classObj.seats);
        }
    });
    return totalSeats
}

// This function generates a list of seat objects based on the total number of seats and the column configuration of the airplane.
export const createSeats = (totalSeats, classes) => {
    // Initialize an empty array to store the generated seat objects
    const newSeats = [];
    let num = 1;

    for(let i = 0; i < classes.length; i++){
        const classSeats = []
        let position = 0;
        for(let j = 0; j < classes[i].seats; j++){
            // Generate the seat number, where `String.fromCharCode(65)` converts 65 to 'A', 66 to 'B', etc.
            const letter = String.fromCharCode(65 + position);
            classSeats.push({
                seatNumber: `${letter}${num}`,  // e.g., "A1", "B1", etc.
            });

            if(position === classes[i].columns.split('x').reduce((total, column) => total + parseInt(column), 0) -1){
                position = 0;
                num++;
            }else{
                position++;
            }
        }
        newSeats.push({className: classes[i].className, classSeats});
        }

    return newSeats;
};

// This function generates flight classes based on the seat layout and seat distribution for each class.
export const createClasses = (classes, seats) => {
    let offset = 0;  // Offset to keep track of where to start assigning seats in the `seats` array.
    
    // Map over the classes and assign seats to each class.
    const newClasses = classes.map(classObj => {
        // Return a new object representing the class with its name, price, and the seats it contains.
        return {
            className: classObj.className,  // e.g., "Economy", "Business", "First".
            price: classObj.price,  // The price for this class
            seats: seats.find(seat => seat.className === classObj.className).classSeats,  // List of seats assigned to this class
            columns: classObj.columns
        };
    });

    // Return the generated list of class objects
    return newClasses;
};
