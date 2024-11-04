import { useEffect, useState } from "react";
import { handleBlur, handleFocus } from "../../../utils/handleInput";

const FlightSecondForm = ({state, dispatch}) => {
    const handleClasses = (className) => {
        const classIndex = state.classes.findIndex(item => item.className === className);
        if (classIndex !== -1) {
            dispatch({type: 'SET_CLASSES', payload: state.classes.filter((_, index) => index !== classIndex)})
        } else {
            dispatch({type: 'SET_CLASSES', payload: [...state.classes, { className }]})
        }
    };
    
    useEffect(() => {
        console.log(state.classes)
    }, [state])

    return (
        <div className="container">
            <form>
                <h2>Select Classes</h2>
                <div style={{marginTop: '50px'}}>
                    <label htmlFor="ecomony">Economy</label>
                    <input type="checkbox" name="economy" onClick={() => handleClasses('Economy')}/>
                    <label htmlFor="business">Business</label>
                    <input type="checkbox" name="business" onClick={() => handleClasses('Business')}/>
                    <label htmlFor="first">First</label>
                    <input type="checkbox" name="first" onClick={() => handleClasses('First')}/>
                </div>
                {state.classes.length > 0 && state.classes.map(className =>  
                    <div>
                        <h3>{className.className}</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                            <div className='input-container'>
                                <input 
                                    className='input'
                                    type="number" 
                                    placeholder="Seats"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    onChange={(e) => dispatch({type: 'SET_CLASS_SEATS', payload: {seats: e.target.value, className: className.className}})}
                                />
                                <span>Seats</span>
                            </div>
                            <div className='input-container'>
                                <input 
                                    className='input'
                                    type="number" 
                                    placeholder="Price"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    onChange={(e) => dispatch({type: 'SET_CLASS_PRICE', payload: {price: e.target.value, className: className.className}})}
                                />
                                <span>Price</span>
                            </div>
                        </div>
                    </div>

                )}
                <input type="submit" className="next-btn" style={{marginTop: '40px'}} disabled={state.classes.length > 0 ? false : true}/>
            </form>        

        </div>
    )
}

export default FlightSecondForm