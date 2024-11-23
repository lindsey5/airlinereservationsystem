import { useEffect, useState } from "react"
import './AdminForm.css'
import { handleBlur, handleFocus } from '../../../utils/handleInput'

const AddFrontDeskForm = ({close, handleSubmit}) => {
    const [frontDeskData, setFrontDeskData] = useState({
        firstname: '',
        lastname: '',
        email: '',
    })

    return (
        <div className='admin-form'>
            <div className='container'>
            <h2>Add Front Desk Agent</h2>
            <form onSubmit={handleSubmit}>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                    <div className='input-container'>
                        <input  
                            className='input'
                            type="text"
                            name="firstname"
                            value={frontDeskData.firstname}
                            onChange={(e) => {
                                setFrontDeskData(prevData => ({...prevData, firstname: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Firstname'
                            required
                        />
                        <span>Firstname</span>
                    </div>
                    <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="lastname"
                            value={frontDeskData.lastname}
                            onChange={(e) => {
                                setFrontDeskData(prevData => ({...prevData, lastname: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Lastname'
                            required
                        />
                        <span>Lastname</span>
                    </div>
                </div>
                <div className='input-container'>
                        <input
                            className='input'
                            type="text"
                            name="email"
                            value={frontDeskData.email}
                            onChange={(e) => {
                                setFrontDeskData(prevData => ({...prevData, email: e.target.value}))
                            }}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            placeholder='Email'
                            required
                        />
                        <span>Email</span>
                </div>
                <div className="buttons">
                    <button className='close-btn' onClick={close}>Close</button>
                    <input type="submit" className="submit-btn" />
                </div>
            </form>
            </div>
        </div>
    )

}

export default AddFrontDeskForm