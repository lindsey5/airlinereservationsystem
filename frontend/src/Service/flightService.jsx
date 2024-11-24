export const cancelFlight = async ({bookId, flightId, showError, setError}) => {
    try{
       if(confirm('Are you sure do you wan\'t to cancel this flight?')){
            const response = await fetch(`/api/flight/cancel`,{
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
