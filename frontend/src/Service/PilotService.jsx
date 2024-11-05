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