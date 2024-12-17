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

export const get_incomes_per_month = async (year) => {
  const currentYear = year ? Number(year) : new Date().getFullYear();

  try {
      // Initialize incomes_array with 0 for all 12 months
      let incomes_array = new Array(12);

      const incomesPerMonth = await Payment.aggregate([
          // Match documents where status is 'paid'
          {
              $match: { status: 'paid' }
          },
          // Project year and month from createdAt and include total_amount
          {
              $project: {
                  year: { $year: "$createdAt" },
                  month: { $month: "$createdAt" },
                  total: "$total_amount",
              }
          },
          // Filter by the provided year
          {
              $match: {
                  year: currentYear,
              }
          },
          // Group by year and month, summing the total amount
          {
              $group: {
                  _id: { year: "$year", month: "$month" },
                  total: { $sum: "$total" },
              }
          },
          // Sort by year and month (ascending)
          {
              $sort: { "_id.year": 1, "_id.month": 1 }
          }
      ]);

      // Populate the incomes_array with the monthly totals
      incomesPerMonth.forEach(income => {
          // Subtract 1 from the month to align with array index (0-11)
          incomes_array[income._id.month - 1] = income.total;
      });

      // Return the incomes array with totals for each month
      return incomes_array;

  } catch (err) {
      console.error('Error fetching incomes per month:', err);
      return null;
  }
};
