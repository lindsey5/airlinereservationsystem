import './AdminPilots.css'

const AdminPilots = () => {
    return (
        <section className="admin-pilots">
            <h1>Pilots</h1>
            <div className='table-container'>
            <table>
                <thead>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Age</th>
                    <th>Date of Birth</th>
                    <th>Nationality</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Action</th>
                </thead>
                <tbody>
                <tr>
                    <td>123456789</td>
                    <td>Lindsey Samson</td>
                    <td>21</td>
                    <td>August 3, 2003</td>
                    <td>Filipino</td>
                    <td>lindseysamson5@gmail.com</td>
                    <td>09505505306</td>
                    <td>Available</td>
                </tr>
                
            </tbody>
            </table>
            </div>
            <button className='add-btn'>Add Pilot</button>
        </section>
    )
}

export default AdminPilots;