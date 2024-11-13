export const createPaymentLink = async(bookings) =>{
    try{
        const response = await fetch(`/api/payment-link`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({bookings}),
        })
        const result = await response.json();  
        if(response.ok){
            return result;
        }
        console.log(result)
        return null
    }catch(err){
        console.error(err);
        return null;
    }
}