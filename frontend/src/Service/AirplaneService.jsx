export const addAirplane = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAirplane = {
        model: formData.get('model'),
        passengerSeatingCapacity: formData.get('seat-capacity'),
        columns: formData.get('seats-column'),
        currentLocation: formData.get('currentLocation'),
        code: formData.get('code'),
        airline: formData.get('airline')
    }
    try{
        const response = await fetch('/api/airplane',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAirplane),
        })
        
        const result = await response.json();
        if(response.ok){
            window.location.reload()
        }

        if(result.errors){
            console.log(result)
            alert(result.errors[0])
        }
    }catch(err){
        alert('Error adding pilot')
    }
}

export const deleteAirplane = async (id) => {
    if(confirm('Remove Airplane?')){
         try{
             const response = await fetch(`/api/airplane/${id}`,{
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json',
                 },
             })
 
             if(response.ok){
                 window.location.reload()
             }
         }catch(err){
             alert('Error deleting airplane')
         }
    }

 }

export const updateAirplane = async (e, newData) => {
    e.preventDefault();
    console.log(newData)
    const id = newData._id;

    if(confirm('Click ok to continue')){
        try{
            const response = await fetch(`/api/airplane/${id}`,{
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newData)
            })
            const result = await response.json();
            if(response.ok){
                window.location.reload();
            }

            if(result.errors){
                alert(result.errors[0])
            }
            
        }catch(err){
            alert('Error updating airplane')
        }
   }
}