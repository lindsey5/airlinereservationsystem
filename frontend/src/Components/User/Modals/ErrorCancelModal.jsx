import './ErrorCancel.css'

const ErrorCancelModal = ({close}) => {

    return (
        <div className="error-cancel-container">
            <div className="error-cancel-modal">
                <img src="/icons/cancel.png" alt="" />
                <h2>Error</h2>
                <p>You cannot cancel a flight on the same day of booking or within one day prior to the flight's departure.</p>
                <button onClick={close}>Ok</button>
            </div>
        </div>

    )
}

export default ErrorCancelModal