import './FlightModal.css';
import './AddAdminSuccess.css'

const AddAdminSuccess = ({adminData, close}) => {
    return(
        <div className="modal-container">
            <div className='add-admin-sucess'>
                <img src="/icons/check.png" alt="" />
                <h2>New Admin Added</h2>
                <p>Employee Id: {adminData.employeeId}</p>
                <p>Password: {adminData.password}</p>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default AddAdminSuccess