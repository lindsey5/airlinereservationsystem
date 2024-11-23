import './FlightModal.css';
import './AddSuccess.css'

const AddAdminSuccess = ({close}) => {
    return(
        <div className="modal-container">
            <div className='add-success'>
                <img src="/icons/check.png" alt="" />
                <h2>New Admin Added</h2>
                <button onClick={close}>Close</button>
            </div>
        </div>
    )
}

export default AddAdminSuccess