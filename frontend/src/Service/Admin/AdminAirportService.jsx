export const addAirport = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newAirport = {
        airport: formData.get('airport'),
        airport_code: formData.get('airport_code'),
        city: formData.get('city'),
        country: formData.get('country'),
    }
    
    try{
        const response = await fetch('/api/airport',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newAirport),
        })
        const result = await response.json();
        if(response.ok){
            window.location.reload()
        }

        if(result.errors){
            alert(result.errors[0]);
        }

    }catch(err){
        alert('Error adding pilot')
    }
}

export const deleteAirport = async (id) => {
    if(confirm('Remove Airport?')){
         try{
             const response = await fetch(`/api/airport/${id}`,{
                 method: 'DELETE',
                 headers: {
                     'Content-Type': 'application/json',
                 },
             })
 
             if(response.ok){
                 window.location.reload()
             }
         }catch(err){
             alert('Error deleting airport')
         }
    }
 }


 export const updateAirport = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const newData = {
        airport: formData.get('airport'),
        airport_code: formData.get('airport_code'),
        city: formData.get('city'),
        country: formData.get('country'),
    }

    if(confirm('Click ok to continue')){
        try{
            const response = await fetch(`/api/airport/${id}`,{
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