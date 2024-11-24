import Payment from "../model/Payment.js";
import { errorHandler } from "../utils/errorHandler.js"

export const get_payment = async (req,res) => {
    try{
        const { booking_id, flight_id } = req.query;
        const payment = await Payment.findOne({
            booking_id,
            flight_id,
        });
        
        res.status(200).json(payment);

    }catch(err){
        const errors = errorHandler(err);
        res.status(400).json({errors});
    }
}