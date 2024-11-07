import { useState } from 'react';
import './AddAdminStyle.css';

function AddAdmin(){
    const [isCancelled, handleCancel] = useState(false);
    const [employeeId, setEmployeeId] = useState('');
    const [uniquePin, setUniquePin] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');

    const cancelClicked = () => {
        handleCancel(true);
    }

    const saveNewAdmin = async (e) => {
        e.preventDefault(); // Prevent the default form submission

        const adminData = {
            employeeId,
            uniquePin,
            email,
            phoneNumber,
            question,
            answer,
        };

        try {
            const response = await fetch('/add-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(adminData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setEmployeeId('');
            setUniquePin('');
            setEmail('');
            setPhoneNumber('');
            setQuestion('');
            setAnswer('');
        } catch (error) {
            console.error('Error adding admin:', error);
        }
    }

    return(
        <div className='main-container'>
            <div className='addAdmin-container' stlye={{display: isCancelled ? 'none' : `flex`}}>
                <h1>ADD NEW ADMIN</h1>

                <input 
                    type='text' 
                    placeholder='Employee Id' 
                    value={employeeId} 
                    onChange={(e) => setEmployeeId(e.target.value)} 
                    required 
                />
                <input 
                    type='password' 
                    placeholder='Unique Pin' 
                    value={uniquePin} 
                    onChange={(e) => setUniquePin(e.target.value)} 
                    required 
                />
                <input 
                    type='email' 
                    placeholder='Email' 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type='text' 
                    placeholder='Phone Number' 
                    value={phoneNumber} 
                    onChange={(e) => setPhoneNumber(e.target.value)} 
                    required 
                />

                <select 
                    type='text' 
                    placeholder='Phone Number' 
                    value={question} 
                    onChange={(e) => setQuestion(e.target.value)} 
                    required 
                >
                    <option value="" disabled>Select a question...</option>
                    <option value="motherMaidenName">What is your mother's maiden name?</option>
                    <option value="firstPet">What was the name of your first pet?</option>
                    <option value="birthCity">In what city were you born?</option>
                    <option value="favoriteColor">What is your favorite color?</option>
                    <option value="childhoodHero">Who was your childhood hero?</option>
                    <option value="highSchool">What high school did you attend?</option>
                    <option value="firstCar">What was the make and model of your first car?</option>
                </select>

                <input 
                    type='text' 
                    placeholder='Answer to the question' 
                    value={answer} 
                    onChange={(e) => setAnswer(e.target.value)} 
                    required 
                />

                <div className='buttons'>
                    <button onClick={saveNewAdmin}>Add New Admin</button>
                    <button onClick={cancelClicked}>X</button>
                </div>
            </div>
        </div>
    );
}

export default AddAdmin;