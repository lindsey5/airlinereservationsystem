import Payment from "../model/Payment.js";

export const get_incomes_today = async () =>{
    try{
        const payments = await Payment.find({payment_date: new Date().toISOString().split('T')[0], status: 'paid'})
        const incomesToday = payments.reduce((total, payment) => payment.total_amount + total, 0);
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