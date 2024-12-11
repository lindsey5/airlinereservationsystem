export const cancelPassengerFlight = async ({bookId, flightId, showError, setError}) => {
    try{
       if(confirm('Are you sure do you wan\'t to cancel this flight?')){
            const response = await fetch(`/api/flight/cancel/passenger`,{
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({bookId, flightId}),
            })
            if(response.ok){
                window.location.reload();
            }
            if(!response.ok){
                const result = await response.json();
                showError();
                setError(result.errors[0]);
            }
       }
    }catch(err){
        console.error(err)
    }
}

export const getFlight = async (id) => {
    console.log(id)
    try{
        const response = await fetch(`/api/flight/${id}`);
        if(response.ok){
            return await response.json();
        }
    }catch(err){
        console.log(err)
    }
}
