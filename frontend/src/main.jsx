import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  createRoutesFromElements,
  Navigate
} from "react-router-dom";
import Home from './Pages/HomePage/Home';
import AdminLayout from './Layouts/AdminLayout';
import { SearchContextProvider } from './Context/SearchContext';
import UserLogin from './Pages/AuthPages/UserLogin';
import AdminDashboard from './Pages/AdminPage/AdminDashboard';
import AdminPilots from './Pages/AdminPage/AdminPilots';
import AdminAirplanes from './Pages/AdminPage/AdminAirplanes';
import AdminFlights from './Pages/AdminPage/AdminFlights';
import AdminAirports from './Pages/AdminPage/AdminAirports';
import './index.css'
import UserSignup from './Pages/AuthPages/UserSignup';
import AddAdmin from './Pages/AdminPage/AddAdmin';
import AdminLogIn from './Pages/AuthPages/AdminLogin';
import { PublicRoute } from './routes/PublicRoute';
import { UserRoute } from './routes/UserRoute';
import UserLayout from './Layouts/UserLayout';
import UserHome from './Pages/UserPage/UserHome';
import SearchResults from './Pages/UserPage/SearchResults';
import AvailableFlights from './Pages/UserPage/AvailableFlights';
import BookingPage from './Pages/UserPage/BookingPage';
import TicketPage from './Pages/UserPage/TicketPage';
import Success from './Pages/UserPage/Success';
import About from './Pages/HomePage/About';
import AdminSearchPage from './Pages/AdminPage/AdminSearchPage';
import AdminAvailableFlight from './Pages/AdminPage/AdminAvailableFlight';
import AdminSearchResults from './Pages/AdminPage/AdminSearchResults';
import AdminBookingPage from './Pages/AdminPage/AdminBookingPage';
import UserFlights from './Pages/UserPage/UserFlights';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path='/add-admin' element={<AddAdmin />} />
        <Route path='/admin/login' element={<AdminLogIn />} />
        <Route path='/user/' >
          <Route path='login' element={<UserLogin />} />
          <Route path='signup' element={<UserSignup />} />
        </Route>
      </Route>

      <Route path='/about' element={<About />}/>
      <Route path="/tickets" element={<TicketPage />}/>

      <Route element={<UserRoute />}>
        <Route element={<UserLayout />}>
          <Route path='/user/'>
            <Route path='home' element={<UserHome />} />
            <Route path='search-results' element={<SearchResults />} />
            <Route path='available-flights' element={<AvailableFlights />} />
            <Route path='booking' element={<BookingPage />} />
            <Route path='booking/success' element={<Success />} />
            <Route path='flights' element={<UserFlights />} />
          </Route>
        </Route>
      </Route>

      <Route path='/admin/'>
        <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='pilots' element={<AdminPilots />} />
          <Route path='airplanes' element={<AdminAirplanes />} />
          <Route path='flights' element={<AdminFlights />} />
          <Route path='airports' element={<AdminAirports />} />
          <Route path='search-results' element={<AdminSearchResults />} />
          <Route path='booking' element={<AdminBookingPage />} />
          <Route path='flight/'>
            <Route path='book' element={<AdminSearchPage />}/>
            <Route path='available' element={<AdminAvailableFlight />} />
          </Route>
        </Route>
      </Route>
      
      <Route path="*" element={<Navigate to="/" />} />
    </>
  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SearchContextProvider>
      <RouterProvider router={router} />
    </SearchContextProvider>
  </StrictMode>,
)
