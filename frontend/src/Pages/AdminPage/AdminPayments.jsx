import useAdminPaginationReducer from "../../hooks/adminPaginationReducer";
import { useState, useEffect } from "react";
import AdminPagination from "../../Components/Admin/Pagination/AdminPagination";
import '../../styles/TablePage.css';
import { formatDate } from "../../utils/dateUtils";
import { formatPrice } from "../../utils/formatPrice";
import PaymentDetails from "../../Components/Modals/PaymentDetails";

const AdminPayments = () => {
    const [payments, setPayments] = useState();
    const {state, dispatch} = useAdminPaginationReducer();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showPayment, setShowPayment] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState();

    const generateCSV = () => {
        const csvRows = [];
        const headers = ['Booking Ref', 'Booked By', 'Payment Date', 'Status', 'Amount'];
        csvRows.push(headers.join(',')); // Add header row
    
        // Add data rows
        payments.forEach(row => {
          const values = [row.booking_ref, row.booked_by, formatDate(row.createdAt), row.status, row.total_amount]
          csvRows.push(values);
        });
        csvRows.push(['Total', payments.reduce((total, payment) => total + payment.total_amount, 0)]);
        // Create a Blob from the CSV string
        const csvBlob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const csvUrl = URL.createObjectURL(csvBlob);
    
        // Create a link to download the CSV
        const link = document.createElement('a');
        link.href = csvUrl;
        link.download = 'cloudpeakairlines_payments_report.csv';
        link.click();
      };

    useEffect(() => {
        const fetchAirports = async () => {
            dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true})
            dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true})
            setLoading(true)
            try{
                const response = await fetch(`/api/payment/payments?page=${state.currentPage}&&limit=50&&from=${startDate}&&to=${endDate}&&searchTerm=${searchTerm}`);
                if(response.ok){
                    const result = await response.json();
                    result.currentPage === result.totalPages || result.totalPages === 0 ? dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: true}) :  dispatch({type: 'SET_DISABLED_NEXT_BTN', payload: false});
                    result.currentPage === 1 ? dispatch({type: 'SET_DISABLED_PREV_BTN', payload: true}) : dispatch({type: 'SET_DISABLED_PREV_BTN', payload: false});
                    dispatch({type: 'SET_TOTAL_PAGES', payload: result.totalPages});
                    setPayments(result.payments)
                    setLoading(false)
                }
            }catch(err){

            }
        }

        fetchAirports();

    },[state.currentPage, startDate, endDate, searchTerm])

    useEffect(() => {
        document.title = "Payments | Admin";
    }, []);

    return (
        <main className="table-page">
            {showPayment && <PaymentDetails payment={selectedPayment} close={() => setShowPayment(false)}/>}
            <h1>Payments</h1>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <div className="date-filter-container">
                <input type="search" placeholder='Search' style={{marginRight: '30px', marginTop: '40px'}} onChange={(e) => setSearchTerm(e.target.value)}/>
                    <div>
                        <p>From</p>
                        <input type="date" onChange={(e) => setStartDate(e.target.value)}/>
                    </div>
                    <div>
                        <p>To</p>
                        <input type="date" onChange={(e) => setEndDate(e.target.value)}/>
                    </div>
                </div>
            </div>
            <div className="parent-table-container">
                <AdminPagination state={state} dispatch={dispatch} />
                <div className='table-container'>
                    {loading && <p className="loading">Please Wait</p>}
                    <table>
                        <thead>
                            <tr>
                                <th>Booking Ref</th>
                                <th>Booked By</th>
                                <th>Payment Date</th>
                                <th>Status</th>
                                <th>Total Amount</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {payments && !loading && payments.map(payment => 
                            <tr>
                                <td>{payment.booking_ref}</td>
                                <td>{payment.booked_by}</td>
                                <td>{formatDate(payment.createdAt)}</td>
                                <td>{payment.status}</td>
                                <td>{formatPrice(payment.total_amount)}</td>
                                <td>
                                    <button onClick={() => {
                                        setSelectedPayment(payment);
                                        setShowPayment(true)
                                    }}>
                                    <img src="/icons/eye (1).png" alt="" />
                                    </button>
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
            <div style={{display:"flex", justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Total: {payments && formatPrice(payments.reduce((total, payment) => total + payment.total_amount, 0))}</h2>
            <button className="add-btn" style={{padding: '7px 50px'}} onClick={generateCSV}>Export</button>
            </div>
        </main>
    )
}

export default AdminPayments