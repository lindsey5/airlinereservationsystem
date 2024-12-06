export const signupUser = async (data) => {
    try{
        const response = await fetch('/api/user/signup',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })

        if(response.ok){
            return await response.json()
        }
        return null

    }catch(err){

    }
}

export const loginUser = async (email, password) => {
    try{
        const response = await fetch('/api/user/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                password
            }),
        })
        const result = await response.json();
        return result
    }catch(err){

    }

}

export const updateUser = async (data) => {
    if(confirm('Click ok to continue')){
        try{
            const response = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
    
            if(response.ok){
                window.location.reload();
            }
        }catch(err){
            alert('Updating error');
        }
    }
}