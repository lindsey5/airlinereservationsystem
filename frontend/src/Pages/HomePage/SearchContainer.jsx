import { useContext } from "react";
import './SearchContainer.css';
import SearchForms from "../../Components/Search/SearchForms";
import { useNavigate } from "react-router-dom";
import ButtonsContainer from "../../Components/Search/ButtonsContainer";
import SelectContainer from "../../Components/Search/SelectContainer";


const SearchContainer = () => {
    const navigate = useNavigate()

    return (
        <div className="search-container">
            <SelectContainer />
            <SearchForms />
            <ButtonsContainer handleSearch={() => navigate('/user/login')}/>
        </div>
    );
};

export default SearchContainer;
