import { useNavigate } from "react-router-dom"
import ButtonsContainer from "../../Components/Search/ButtonsContainer"
import SearchForms from "../../Components/Search/SearchForms"
import SelectContainer from "../../Components/Search/SelectContainer"
import './FrontDeskSearchPage.css'

const FrontDeskSearchPage = () => {
    const navigate = useNavigate();
    return(
        <div className="frontdesk-search-page">
            <div>
            <h1>Book Flight</h1>
            <a href="/frontdesk/flight/available">View Available Flights</a>
            </div>
            <div className="container">
                <SelectContainer />
                <SearchForms />
                <ButtonsContainer handleSearch={() => navigate('/frontdesk/search-results') }/>
            </div>
        </div>
    )
}

export default FrontDeskSearchPage