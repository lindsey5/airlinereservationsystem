import { useEffect, useState } from "react"

const FlightSecondForm = ({state, dispatch}) => {

    return (
        <div className="container">
            <form>
                <h2>Classes</h2>
                <input type="radio" name="classes" value='Economy'/>
                <input type="radio" name="classes" value='Business' />
                <input type="radio" name="classes" value='First' />

                <input type="submit" className="next-btn"/>
            </form>        

        </div>
    )
}

export default FlightSecondForm