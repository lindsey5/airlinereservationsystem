import axios from "axios";

export const useAdminLogin = async (employeeId, password, setError) =>{
    try {
        // Send a POST request to your Node.js server
        const response = await axios.post('/api/admin/login', {
            employeeId,
            password,
        });

        if(response.data.id){
            window.location.reload();
        }
    } catch (error) {
        setError(error.response.data.errors[0])
        console.error('Error logging in:', error);
    }
}

export const useFrontDeskLogin = async (employeeId, password, setError) =>{
    try {
        // Send a POST request to your Node.js server
        const response = await axios.post('/api/front-desk/login', {
            employeeId,
            password,
        });

        if(response.data.id){
            window.location.reload();
        }
    } catch (error) {
        setError(error.response.data.errors[0])
        console.error('Error logging in:', error);
    }
}