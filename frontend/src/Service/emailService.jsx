export const sendVerificationCode = async (email) => {
    try{
        const response = await fetch(`/api/user/verification-code?email=${email}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        return await response.json();
    }catch(err){
        return null
    }
}

export const verifyCode = async (code) => {
    try{
        const response = await fetch(`/api/verify-code?code=${code}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            
        return await response.json();
    }catch(err){
        return null
    }
}
