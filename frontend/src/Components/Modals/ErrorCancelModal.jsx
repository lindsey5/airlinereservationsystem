import './ErrorCancel.css'

const ErrorCancelModal = ({close, error}) => {
    console.log(error)
    return (
        <div className="error-cancel-container">
            <div className="error-cancel-modal">
                <img src="/icons/cancel.png" alt="" />
                <h2>Error</h2>
                <p>{error}</p>
                <button onClick={close}>Ok</button>
            </div>
        </div>

    )
}

export default ErrorCancelModal