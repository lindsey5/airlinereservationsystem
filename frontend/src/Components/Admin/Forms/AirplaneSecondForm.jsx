import {  useReducer, useState } from "react";
import { handleBlur, handleFocus, handleNegativeAndDecimal } from "../../../utils/handleInput";

const validateColumns = (columns) => {
    const regex = /^(\d+x)+\d+$/;
    return regex.test(columns);
};

const airplaneReducer = (state, action) => {
    switch(action.type){
        case 'SET_CLASSES':
            return {...state, classes: action.payload}
        case 'SET_CLASS_SEATS':
            const classname = action.payload.className;
            const seats = action.payload.seats;
            return {
                ...state,
                classes: state.classes.map(classItem => 
                    classItem.className === classname 
                        ? { ...classItem, seats }
                        : classItem
                )
            };
        case 'SET_CLASS_COLUMNS':
            return {
                ...state,
                classes: state.classes.map(classItem => 
                    classItem.className === action.payload.className
                        ? { ...classItem, columns: action.payload.columns }
                        : classItem
                )
            };
    }
}

const FlightSecondForm = ({airplaneData, handleSubmit, close}) => {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [state, dispatch] = useReducer(airplaneReducer, {...airplaneData, classes: airplaneData.classes || []});

    const submit = async (e) => {
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
            await handleSubmit(state);
            setLoading(false)
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
    

    return (
        <div className="container">
            {loading && <div className="loader-container">
                <div className="loader"></div>
            </div>}
             <span className='close' onClick={close}>X</span>
            <form onSubmit={submit}>
                <h2>Select Classes</h2>
                <div style={{marginTop: '50px'}}>
                    <label htmlFor="first">First</label>
                    <input type="checkbox" checked={state?.classes.find(classObj => classObj.className === 'First')} name="first" onClick={() => handleClasses('First')}/>
                    <label htmlFor="business">Business</label>
                    <input type="checkbox" checked={state?.classes.find(classObj => classObj.className === 'Business')} name="business" onClick={() => handleClasses('Business')}/>
                    <label htmlFor="ecomony">Economy</label>
                    <input type="checkbox" checked={state?.classes.find(classObj => classObj.className === 'Economy')} name="economy" onClick={() => handleClasses('Economy')}/>
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
                                    value={className.seats || ''}
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
                                    type="text" 
                                    placeholder="Columns"
                                    onFocus={handleFocus}
                                    onBlur={handleBlur}
                                    required
                                    value={className.columns || ''}
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