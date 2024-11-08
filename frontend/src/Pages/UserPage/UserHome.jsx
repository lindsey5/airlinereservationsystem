import { useEffect } from "react";
import SearchForms from "../../Components/Search/SearchForms";

const UserHome = () => {

    useEffect(() => {
        document.title = "Home";
    },[]);

    return (
        <div>
            <SearchForms />
        </div>
    )


}

export default UserHome