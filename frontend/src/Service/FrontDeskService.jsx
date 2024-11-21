
export const addFrontDeskAgent = async (e) => {
    const password = prompt('Enter code to continue');
    if(password === 'admin1234@cloudpeak'){
        const formData = new FormData(e.target);
        const newAdmin= {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
        }
        try{
            const response = await fetch('/api/front-desk',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            })
            
            const result = await response.json();
            return result

        }catch(err){
            alert('Error adding front desk agent')
        }
    }else{
        alert('Incorrect code')
    }
}


export const deleteFrontDeskAgent = async (id) => {
    if(confirm('Remove this Agent?')){
        const password = prompt('Enter code to continue');
        if(password === 'admin1234@cloudpeak'){
            try{
                const response = await fetch(`/api/front-desk/${id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
    
                if(response.ok){
                    window.location.reload()
                }
            }catch(err){
                alert('Error deleting front desk agent')
            }
        }else{
            alert('Code is incorrect');
        }
    }
 }