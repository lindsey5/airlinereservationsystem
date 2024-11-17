import { useNavigate } from "react-router-dom"
import ButtonsContainer from "../../Components/Search/ButtonsContainer"
import SearchForms from "../../Components/Search/SearchForms"
import SelectContainer from "../../Components/Search/SelectContainer"
import './AdminSearchPage.css'

const AdminSearchPage = () => {
    const navigate = useNavigate();
    return(
        <div className="admin-search-page">
            <div>
            <h1>Book Flight</h1>
            <a href="/admin/flight/available">View Available Flights</a>
            </div>
            <div className="container">
                <SelectContainer />
                <SearchForms />
                <ButtonsContainer handleSearch={() => navigate('/admin/search-results') }/>
            </div>
        </div>
    )
}

export default AdminSearchPage