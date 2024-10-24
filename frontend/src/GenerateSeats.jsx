const GenerateSeats = () =>{
    const rows = 5;
    const seats = 50;
    const rowsArray = [];
    
    for(let i = 0; i < rows; i++){
        const seatsArray = [];
        const letter = String.fromCharCode(65 + i);
        for(let j = 1; j <= seats / rows; j++){
            seatsArray.push(
                <button key={j} style={{margin: '5px'}} value={`${letter + j}`} onClick={(e)=> console.log(e.target.value)}>{j}</button>
            )
        }

        rowsArray.push(
            <div key={i} style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <strong>{letter}</strong>
                {seatsArray}
            </div>
        )
    }

    return (
        <div style={{display: 'flex'}}>
            {rowsArray}
        </div>
    );

}

export default GenerateSeats;