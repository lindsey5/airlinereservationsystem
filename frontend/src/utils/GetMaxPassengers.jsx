import { getFlight } from "../Service/flightService";

const GetMaxPassengers = async (flights, className) => {
    const lowest = await Promise.all(flights.sort(async (a, b) => {
        const flightA = await getFlight(a._id || a.id);
        const MaxA = flightA.flight.classes
        .find(classObj => classObj.className === className)
        .seats.filter(seat => seat.status === 'available')
        .length;

        const flightB = await getFlight(a._id || a.id);
            const MaxB = flightB.flight.classes
            .find(classObj => classObj.className === className)
            .seats.filter(seat => seat.status === 'available')
            .length
            return MaxA - MaxB
        }));

        const flight = await getFlight(lowest[0]._id || lowest[0].id)

        return flight.flight.classes
        .find(classObj => classObj.className === className)
        .seats.filter(seat => seat.status === 'available')
        .length

}


export default GetMaxPassengers