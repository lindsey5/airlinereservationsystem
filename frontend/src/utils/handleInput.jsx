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
