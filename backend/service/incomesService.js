import Payment from "../model/Payment.js";

export const get_incomes_today = async () =>{
    try{
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); 

        const incomesToday = await Payment.aggregate([
            { 
                $match: {
                    createdAt: { 
                        $gte: startOfDay, 
                        $lt: endOfDay 
                    }
                }
            },
            {
                $group: {
                    _id: { $sum: "$total_amount" }
                }
            }
        ]);

        return incomesToday
    }catch(err){
        return null
    }
}

export const get_incomes_per_month = async () =>{
    const currentYear = new Date().getFullYear();
    try{
        let incomes_array = new Array(12);
        const incomesPerMonth = await Payment.aggregate([
            {
                $match: { status: 'paid' }
            },
            {
              $project: {
                year: { $year: "$createdAt" }, 
                month: { $month: "$createdAt" },
                total: "$total_amount", 
              }
            },
            {
              $match: {
                year: currentYear,
              }
            },
            {
              $group: {
                _id: { year: "$year", month: "$month" }, 
                total: { $sum: "$total" }, 
              }
            },
            {
              $sort: { "_id.year": 1, "_id.month": 1 }
            }
          ]);
        incomesPerMonth.forEach(income => {
            incomes_array[income._id.month-1] = income.total
        });

        return incomes_array
    }catch(err){
        return null
    }
} 