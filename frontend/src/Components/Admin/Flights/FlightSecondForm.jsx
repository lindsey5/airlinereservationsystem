import { useCallback, useEffect, useMemo, useState } from "react";
import { handleBlur, handleFocus, handleNegative, handleNegativeAndDecimal } from "../../../utils/handleInput";
import useFetch from "../../../hooks/useFetch";

const validateColumns = (columns) => {
    const regex = /^(\d+x)+\d+$/;
    return regex.test(columns);
};

const FlightSecondForm = ({state, dispatch, close}) => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const { data } = useFetch(`/api/airplane/${state.airplane.code}`);

    const createFlight = async (e) => {
        e.preventDefault();
        const isNotValid = state.classes.find(classObj => {
            return classObj.seats % classObj.columns.split('x').reduce((total, acc) => total + parseInt(acc), 0) !== 0
        })

        const columnsIsNotValid = state.classes.find(classObj => {
            return !validateColumns(classObj.columns);
        })

        if(isNotValid){
            setError(`${isNotValid.className} seats should be divisible by ${isNotValid.columns.split('x').reduce((total, acc) => total + parseInt(acc), 0)}`)
        }else if(columnsIsNotValid){
            setError(`${columnsIsNotValid.className} columns format is invalid. Please use the format "3x3"`)
        }else{
            setLoading(true);
            try{
                const response = await fetch('/api/flight',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(state),
                })
                const result = await response.json();
                if(response.ok){
                    window.location.reload()
                }
        
                if(result.errors){
                    setError(result.errors[0]);
                }
        
            }catch(err){
                setError('Error adding pilot')
            }

            setLoading(false);
        }
    }

    const handleClasses = (className) => {
        const classname = state.classes.find(item => item.className === className);

        if (classname) {
            dispatch({type: 'SET_CLASSES', payload: state.classes.filter(class_name => class_name !== classname)})
        } else {
            const newClasses = [...state.classes, { className }]
            const classes = ['First', 'Business', 'Economy'];
            const sortedNewClasses = classes.map(className => 
                newClasses.find(classObj => classObj.className === className)
            ).filter(Boolean)

            dispatch({type: 'SET_CLASSES', payload: sortedNewClasses})
        }
    };

    const getClassSeats = useCallback((className) => {
        return state.classes.find(classType => classType.className === className).seats;
    }, [state.classes])

    return (
        <div className="container">
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
             <span className='close'onClick={close}>X</span>
            <form onSubmit={createFlight}>
                <h2>Select Classes</h2>
                <p>Plane Code: {state.airplane.code}</p>
                <p>Seat Capacity: {data && data.passengerSeatingCapacity}</p>
                <div style={{marginTop: '50px'}}>
                    <label htmlFor="ecomony">Economy</label>
                    <input type="checkbox" name="economy" onClick={() => handleClasses('Economy')}/>
                    <label htmlFor="business">Business</label>
                    <input type="checkbox" name="business" onClick={() => handleClasses('Business')}/>
                    <label htmlFor="first">First</label>
                    <input type="checkbox" name="first" onClick={() => handleClasses('First')}/>
                </div>
                <div className='classes-container'>
                {state.classes.length > 0 && state.classes.map(className =>  
                    <div key={className.className}>
                        <h3>{className.className}</h3>
                        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px'}}>
                            <div className='input-container'>
                                <input 
                                    className='input'
                                    type="number" 
                                    placeholder="Seats"
                                    min='1'
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    value={getClassSeats(className.className)}
                                    onKeyPress={handleNegativeAndDecimal}
                                    required
                                    disabled={!className.columns}
                                    onChange={(e) => dispatch({type: 'SET_CLASS_SEATS', payload: {seats: e.target.value, className: className.className}})}
                                    
                                />
                                <span>Seats</span>
                            </div>
                            <div className='input-container'>
                                <input 
                                    className='input'
                                    type="number" 
                                    placeholder="Price"
                                    min='1'
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    onKeyPress={handleNegative}
                                    onChange={(e) => dispatch({type: 'SET_CLASS_PRICE', payload: {price: e.target.value, className: className.className}})}
                                />
                                <span>Price</span>
                            </div>
                            <div className='input-container'>
                                <input 
                                    className='input'
                                    type="text" 
                                    placeholder="Columns"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    onChange={(e) => dispatch({type: 'SET_CLASS_COLUMNS', payload: {columns: e.target.value, className: className.className}})}
                                />
                                <span>Columns</span>
                            </div>
                        </div>
                    </div>
                )}
                </div>
                <p style={{color: '#ff3131'}}>{error}</p>
                <input type="submit" 
                    className="next-btn" 
                    style={{marginTop: '40px'}} 
                    disabled={state.classes.length > 0 ? false : true}
                />
            </form>        

        </div>
    )
}

export default FlightSecondForm