
export const addAdmin = async (e) => {
    const password = prompt('Enter code to continue');
    if(password === 'admin1234@cloudpeak'){
        const formData = new FormData(e.target);
        const newAdmin= {
            firstname: formData.get('firstname'),
            lastname: formData.get('lastname'),
            email: formData.get('email'),
        }
        try{
            const response = await fetch('/api/admin',{
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAdmin),
            })
            
            const result = await response.json();
            return result

        }catch(err){
            alert('Error adding admin')
        }
    }else{
        alert('Incorrect code')
    }
}


export const deleteAdmin = async (id) => {
    if(confirm('Remove this Admin?')){
        const password = prompt('Enter code to continue');
        if(password === 'admin1234@cloudpeak'){
            try{
                const response = await fetch(`/api/admin/${id}`,{
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
    
                if(response.ok){
                    window.location.reload()
                }
            }catch(err){
                alert('Error deleting admin')
            }
        }else{
            alert('Code is incorrect');
        }
    }
 }