import { useEffect, useState } from 'react';
import useFetch from '../../hooks/useFetch'
import './AdminDashboard.css'
import { CChart } from '@coreui/react-chartjs';
import { formatPrice } from '../../utils/formatPrice';

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  function generateRandomColors(count = 10) {
    const colors = [];
    for (let i = 0; i < count; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  }

const AdminDashboard = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const { data, loading } = useFetch(`/api/details/dashboard?year=${year}`);  
    const { data: admin } = useFetch('/api/admin');
    const [popularDestinations, setPopularDestinations] = useState([]);

    useEffect(() => {
        document.title = "Dashboard | Admin";
    }, []);

    useEffect(() => {
        const fetchDestinations = async () => {
            try{
                const response = await fetch(`/api/popular-destinations?limit=10&&year=${year}`);
                if(response.ok){
                    setPopularDestinations(await response.json());
                }else{
                    setPopularDestinations([])
                }
            }catch(err){
                console.error(err)
            }
        }

        fetchDestinations();
    }, [year])

    return (
        <div className="admin-dashboard">
            <h1>Hello! {admin?.firstname} {admin?.lastname}.</h1>
            <div className='top-container'>
                <div>
                    <div className='img-container'>
                        <img src="/icons/peso.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.incomesToday ? formatPrice(data.incomesToday) : 'No Incomes'}</h2>
                        <p>Incomes Today</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/plane.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.scheduledFlights && data.scheduledFlights}</h2>
                        <p>Scheduled Flights</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/hat.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.assignedPilot && data.assignedPilot}</h2>
                        <p>Assigned Pilots</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/plane.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.assignedPlanes && data.assignedPlanes}</h2>
                        <p>Assigned Planes</p>
                    </div>
                </div>
            </div>
            <div className='top-container'>
                <div>
                    <div className='img-container'>
                        <img src="/icons/user (1).png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.totalAdmins && data.totalAdmins}</h2>
                        <p>Total Admins</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/receptionist.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.totalFrontDesks && data.totalFrontDesks}</h2>
                        <p>Total Front Desks</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/hat.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.totalPilots && data.totalPilots}</h2>
                        <p>Total Pilots</p>
                    </div>
                </div>
                <div>
                    <div className='img-container'>
                        <img src="/icons/plane.png" alt="" />
                    </div>
                    <div>
                        <h2>{data?.totalAirplanes && data.totalAirplanes}</h2>
                        <p>Total Planes</p>
                    </div>
                </div>
            </div>
                <select 
                    value={year}
                    style={{width: '150px', height: '25px'}} 
                    onChange={(e) => setYear(e.target.value)}>
                        <option value="2023">2023</option>
                    {data?.years && data.years.map(year => <option value={year}>{year}</option>)}
                </select>
            <div className='chart-container'>
                <div className="line-chart-container">
                    {loading && <p>Please wait</p>}
                    <CChart
                    type="line"
                    style={{ width: '100%', height: '400px'}}
                    data={{
                        labels: [
                            "January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"
                            ],
                            datasets: [
                                {
                                    label: `${year} Monthly Incomes`,
                                    backgroundColor: "white",
                                    borderColor: "rgb(110, 178, 255)",
                                    pointBackgroundColor: "rgb(0, 119, 255)",
                                    data: data?.incomesPerMonth,
                                    pointRadius: 4,
                                    tension: 0.2,
                                },
                                ],
                      }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                        }}
                    />
                </div>
                <div className='pie-container'>
                    <CChart
                        type="pie"
                        style={{ width: '100%', height: '90%' }}
                        data={{
                            labels:  popularDestinations?.length > 0 && popularDestinations.map(destination => destination.city),
                            datasets: [
                            {   
                                backgroundColor: generateRandomColors(popularDestinations?.length),
                                data:  popularDestinations?.length > 0 && popularDestinations.map(destination => destination.total),
                            },
                            ],
                        }}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                        }}
                    />
                    <p>{year} Top 10 Most Popular Cities</p>
                </div>
                <div className="bar-chart-container">
                    {loading && <p>Please wait</p>}
                    <CChart
                    type="bar"
                    style={{ width: '100%', height: '400px' }}
                    data={{
                        labels: [
                            "January", "February", "March", "April", "May", "June", 
                            "July", "August", "September", "October", "November", "December"
                            ],
                        datasets: [
                        {
                            label: `${year} Number of Bookings`,
                            backgroundColor: '#f87979',
                            data: data?.bookingsPerMonth,
                        },
                        ],
                    }}
                    labels="months"
                        options={{
                            responsive: true,
                            maintainAspectRatio: false, 
                            plugins: {
                            legend: {
                                display: true,
                            },
                            },
                        }}
                    />
                </div>
            </div>
        </div>

    )
}

export default AdminDashboard