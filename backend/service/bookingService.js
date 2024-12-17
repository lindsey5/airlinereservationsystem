import Booking from "../model/Booking.js";

export const get_bookings_per_month = async (year) =>{
    const currentYear = year ? Number(year) : new Date().getFullYear();
    try{
        const bookingsPerMonth = await Booking.aggregate([
            {
              $project: {
                year: { $year: "$createdAt" }, 
                month: { $month: "$createdAt" },
                content: 1, 
              }
            },
            {
              $match: {
                year: currentYear
              }
            },
            {
              $group: {
                _id: { year: "$year", month: "$month" }, 
                count: { $sum: 1 }, 
              }
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 }
            }
          ]);
          let bookings_array = new Array(12);
  
          bookingsPerMonth.forEach(booking => {
              bookings_array[booking._id.month-1] = booking.count
          });

          return bookings_array
    }catch(err){
        return null
    }
}