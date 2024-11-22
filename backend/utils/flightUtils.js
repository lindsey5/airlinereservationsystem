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

// This function generates a list of seat objects based on the total number of seats and the column configuration of the airplane.
export const createSeats = (totalSeats, columns) => {
    // Split the column configuration (e.g., "3x3") into an array of integers
    const totalColumns = columns.split('x').map(column => parseInt(column, 10));

    // Calculate the total number of columns by adding the values in the array (e.g., 3 + 3 = 6 columns total)
    const sumOfColumns = totalColumns.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    // Initialize an empty array to store the generated seat objects
    const newSeats = [];
    
    // Seat numbering starts from 1
    let num = 1;

    // Loop through the total seats divided by the sum of columns (this will create rows of seats)
    for (let i = 0; i < totalSeats / sumOfColumns; i++) {
        // For each row, loop through the sum of columns (e.g., 6 columns for a "3x3" layout)
        for (let j = 0; j < sumOfColumns; j++) {
            // Generate the seat number, where `String.fromCharCode(65)` converts 65 to 'A', 66 to 'B', etc.
            const letter = String.fromCharCode(65 + j);
            newSeats.push({
                seatNumber: `${letter}${num}`,  // e.g., "A1", "B1", etc.
            });
        }
        num++;  // Increment the seat number for the next row
    }

    // Return the generated list of seat objects
    return newSeats;
};

// This function generates flight classes based on the seat layout and seat distribution for each class.
export const createClasses = (classes, seats) => {
    let offset = 0;  // Offset to keep track of where to start assigning seats in the `seats` array.
    
    // Map over the classes and assign seats to each class.
    const newClasses = classes.map(classObj => {
        const classSeats = [];

        // Loop through the number of seats for this class and assign seats from the `seats` array
        for (let i = 0; i < classObj.seats; i++) {
            classSeats.push(seats[offset]);  // Assign a seat from the available seats array
            offset++;  // Move to the next available seat in the `seats` array
        }

        // Return a new object representing the class with its name, price, and the seats it contains.
        return {
            className: classObj.className,  // e.g., "Economy", "Business", "First".
            price: classObj.price,  // The price for this class
            seats: classSeats,  // List of seats assigned to this class
        };
    });

    // Return the generated list of class objects
    return newClasses;
};