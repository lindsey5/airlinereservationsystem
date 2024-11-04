export const handleFocus = (e) => {
    if(!e.target.classList.contains('onFocus')){
        e.target.classList.add('onFocus')
    }
}

export const handleBlur = (e) => {
   if(!e.target.value){
        e.target.classList.remove('onFocus');
   }
}

export const handleNegativeAndDecimal = (e) => {
    if (e.key === '.' || e.key === '-') {
        e.preventDefault();
    }
};

export const handleNegative =(e) => {
    if (e.key === '-') {
        e.preventDefault();
    }
}