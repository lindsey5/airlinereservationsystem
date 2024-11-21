import useFetch from '../../hooks/useFetch'
import './AdminDashboard.css'
import { CChart } from '@coreui/react-chartjs';

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
    const { data } = useFetch('/api/details/dashboard');
    const { data: popularDestinations } = useFetch('/api/popular-destinations?limit=10')
      
    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <div className='top-container'>
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
            <div className='chart-container'>
                <div className="bar-chart-container">
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
                            label: 'Number of Bookings',
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
                            plugins: {
                                legend: {
                                  labels: {
                                    color: '#333',  
                                  },
                                },
                            },
                        }}
                    />
                    <p>Top 10 Most Popular Cities</p>
                </div>
            </div>
        </div>

    )
}

export default AdminDashboard