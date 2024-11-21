
export const getPaymentId = async (checkout_id) => {
    try{
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              authorization: 'Basic c2tfdGVzdF9EYllaMVRHYTlFcGFBZzVwVmdHM1NDdTk6'
            }
          };
          
        const response = await fetch(`https://api.paymongo.com/v1/checkout_sessions/${checkout_id}`, options)
        if(response.ok){
            const result = await response.json();
            return result.data.attributes.payments[0].id
        }
        return null
    }catch(err){
        console.log(err)
        return null
    }

}

export const refundPayment = async (payment_id, amount) => {
    try{
        const options = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
              authorization: 'Basic c2tfdGVzdF9EYllaMVRHYTlFcGFBZzVwVmdHM1NDdTk6'
            },
            body: JSON.stringify({
              data: {
                attributes: {
                  amount,
                  payment_id,
                  reason: 'others'
                }
              }
            })
          };
          
          const response= await fetch('https://api.paymongo.com/refunds', options)
          if(response.ok){
            return await response.json();
          }

          return null
    }catch(err){
        return null
    }
}
