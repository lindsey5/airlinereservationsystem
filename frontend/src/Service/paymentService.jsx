export const createPaymentLink = async(bookings) =>{
    try{
        const response = await fetch(`/api/payment-link`,{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({bookings}),
        })
        if(response.ok){
            const result = await response.json();  
            return result;
        }
    
        return null
    }catch(err){
        console.error(err);
        return null;
    }
}