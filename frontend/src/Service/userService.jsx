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

export const changeUserPassword = async (data, setError) => {
    if(confirm('Click ok to continue')){
        try{
            const response = await fetch('/api/user/password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
    
            const result = await response.json();
            if(response.ok){
                window.location.href = '/user/home'
            }
            if(result.errors){
                setError(result.errors[0]);
            }
    
        }catch(err){
    
        }
    }
}