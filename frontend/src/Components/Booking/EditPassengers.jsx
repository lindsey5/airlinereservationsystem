import { useEffect, useState } from "react";

const EditPassengers = () => {
    const queryParams = new URLSearchParams(window.location.search); // Create a new URLSearchParams object to parse the query string from the current URL
    const encodedData = queryParams.get('data');  // Retrieve the value of the 'data' parameter from the query string
    const decodedData = JSON.parse(window.atob(decodeURIComponent(encodedData))); // Decode the retrieved value from the query from the url then parse to JSON
    const [currentPassenger, setCurrentPassenger] = useState(0);
    const [flight, setFlight] = useState();

    useEffect(() => {
        setFlight(decodedData)
    }, [])

    const updatePassengers = async(flight) => {

        if(confirm('Click ok to continue')){
            try{
                const response = await fetch('/api/flight/passengers',{
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        booking_id: flight.bookingRef,
                        flight_id: flight.id,
                        passengers: flight.passengers
                    }),
                })
                
                const result = await response.json();
                if(response.ok){
                    window.location.href = '/';
                }else{
                    alert(result.errors[0])
                }
            }catch(err){
                alert('Updating passengers failed')
            }
        }
    }

    const setPassengerDetails = (e, type) => {
        e.preventDefault();
        setFlight(prev => {
            const passengers = prev.passengers;
            passengers[currentPassenger][type] = e.target.value;
            console.log(passengers[currentPassenger])
            return {...prev, passengers}
        })
    };

    return(
        <div className="passenger-form">
            <div className='container'>
                <div>
                    <h1>Update Passenger Details</h1>
                </div>
                <div className='passenger-details-container'>
                    <div className='side-bar'>
                    {flight && Array.from({ length: flight.passengers.length }, (_, i) => (
                        <button 
                            key={i}
                            className={currentPassenger === i ? 'selected' : ''} 
                            onClick={() => setCurrentPassenger(i)}
                            type='button'
                        >Passenger {i+1} ({flight && flight.passengers[i].type})</button>
                    ))}
                    </div>
                    <div className='passenger-details'>
                        <div>
                            <h2>{flight && flight.fareType} Tier</h2>
                            <h2>{flight && flight.passengers[currentPassenger].seatNumber}</h2>
                            <div>
                            <p>{flight && flight.departure.airport_code} to {flight && flight.arrival.airport_code} ✈</p>
                            </div>
                        </div>
                        <hr />
                        <div>
                            Name
                            <p>Please make sure that you enter your name exactly as it is shown on your Valid ID</p>
                            <div className='name-container'>
                                <div>
                                    Firstname
                                    <input type="text" 
                                    value={flight && flight.passengers[currentPassenger].firstname || ''}
                                    onChange={(e) => setPassengerDetails(e, 'firstname')}/>
                                </div>
                                <div>
                                    Lastname
                                    <input type="text" 
                                    value={flight && flight.passengers[currentPassenger].lastname || ''}
                                    onChange={(e) => setPassengerDetails(e, 'lastname')}/>
                                </div>
                            </div>
                        </div>
                        <div>
                            Date of Birth
                            <input 
                                type="date" 
                                onChange={(e) => setPassengerDetails(e, 'dateOfBirth')}
                                value={flight && flight.passengers[currentPassenger].dateOfBirth.split('T')[0] || ''}
                            />
                        </div>
                        <div>
                            Nationality
                            <input 
                            type="text" value={flight && flight.passengers[currentPassenger].nationality || ''}
                            onChange={(e) => setPassengerDetails(e, 'nationality')}/>
                        </div>
                        <div>
                            Country of Issue
                            <input 
                            type="text" value={flight && flight.passengers[currentPassenger].countryOfIssue}
                            onChange={(e) => setPassengerDetails(e, 'countryOfIssue')}
                            />
                        </div>
                        <div>
                            Request (optional)
                            <textarea 
                                value={flight && flight.passengers[currentPassenger].request}
                                onChange={e => setPassengerDetails(e, 'request')}>
                            </textarea>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => updatePassengers(flight)}
                    className='book-btn' 
                    type='submit' 
                >Update</button>
            </div>
        </div>
    )
}

export default EditPassengers