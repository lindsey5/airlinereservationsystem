
const GetMaxPassengers = (flights, className) => {
    const lowest = flights.sort(async (a, b) => {
        const flightA = a;
        const MaxA = flightA.classes
        .find(classObj => classObj.className === className)
        .seats.filter(seat => seat.status === 'available')
        .length;

        const flightB = b;
            const MaxB = flightB.classes
            .find(classObj => classObj.className === className)
            .seats.filter(seat => seat.status === 'available')
            .length
            return MaxA - MaxB
        });
        const flight = lowest[0];

        return flight.classes
        .find(classObj => classObj.className === className)
        .seats.filter(seat => seat.status === 'available')
        .length

}


export default GetMaxPassengers