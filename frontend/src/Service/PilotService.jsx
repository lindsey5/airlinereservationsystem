export const get_pilot = async (id) => {
    try{
        const response = await fetch(`/api/pilot/${id}`);

        if(response.ok){
            return await response.json();
        }
        return null
    }catch(err){

    }
}

export const addPilot = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newPilot = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        age: formData.get('age'),
        dateOfBirth: formData.get('dateOfBirth'),
        nationality: formData.get('nationality')
    }
    try{
        const response = await fetch('/api/pilot',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPilot),
        })

        if(response.ok){
            window.location.reload()
        }
    }catch(err){
        alert('Error adding pilot')
    }
}


export const deletePilot = async (id) => {
   if(confirm('Remove Pilot?')){
        try{
            const response = await fetch(`/api/pilot/${id}`,{
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            })

            if(response.ok){
                window.location.reload()
            }
        }catch(err){
            alert('Error deleting pilot')
        }
   }

}

export const updatePilot = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const id = formData.get('id');
    const newData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        age: formData.get('age'),
        dateOfBirth: formData.get('dateOfBirth'),
        nationality: formData.get('nationality'),
        status: formData.get('status')
    }

    if(confirm('Click ok to continue')){
        try{
            const response = await fetch(`/api/pilot/${id}`,{
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
                throw new Error(result.errors[0]);
            }
            
        }catch(err){
            alert('Error updating pilot')
        }
   }
    
}