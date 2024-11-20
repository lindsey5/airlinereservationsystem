import './ErrorCancel.css'

const ErrorCancelModal = ({close}) => {

    return (
        <div className="error-cancel-container">
            <div className="error-cancel-modal">
                <img src="/icons/cancel.png" alt="" />
                <h2>Error</h2>
                <p>You cannot cancel a flight on the same day it is booked or when it's less than a day before the departure</p>
                <button onClick={close}>Ok</button>
            </div>
        </div>

    )
}

export default ErrorCancelModal