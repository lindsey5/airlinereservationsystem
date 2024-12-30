import './ChangeEmail.css'

const ChangeEmail = () => {
    

    return(
        <div className="change-email">
            <h1>Change Email</h1>
            <div className='input-container'>
                <input type="email" placeholder='Enter new email'/>
                <span>Enter new email</span>
            </div>
            <button>Submit</button>
        </div>
    )
}

export default ChangeEmail