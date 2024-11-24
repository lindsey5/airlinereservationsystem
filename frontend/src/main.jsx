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
import PublicRoute from './routes/PublicRoute';
import UserRoute from './routes/UserRoute';
import UserLayout from './Layouts/UserLayout';
import UserHome from './Pages/UserPage/UserHome';
import SearchResults from './Pages/UserPage/SearchResults';
import AvailableFlights from './Pages/UserPage/AvailableFlights';
import BookingPage from './Pages/UserPage/BookingPage';
import TicketPage from './Pages/UserPage/TicketPage';
import Success from './Pages/UserPage/Success';
import About from './Pages/HomePage/About';
import UserFlights from './Pages/UserPage/UserFlights';
import Admins from './Pages/AdminPage/Admins';
import AdminLogin from './Pages/AuthPages/AdminLogin';
import AdminRoute from './routes/AdminRoute';
import FrontDeskLayout from './Layouts/FrontDeskLayout';
import FrontDeskFlights from './Pages/FrontDesk/FrontDeskFlights';
import FrontDeskSearchResults from './Pages/FrontDesk/FrontDeskSearchResults';
import FrontDeskSearchPage from './Pages/FrontDesk/FrontDeskSearchPage';
import FrontDeskAvailableFlights from './Pages/FrontDesk/FrontDeskAvailableFlight';
import FrontDeskBookingPage from './Pages/FrontDesk/FrontDeskBookingPage';
import FrontDeskAgents from './Pages/AdminPage/FrontDeskAgents';
import FrontDeskLogin from './Pages/AuthPages/FrontDeskLogin';
import FrontDeskRoute from './routes/FrontDeskRoute';
import { SideBarContextProvider } from './Context/SideBarContext';
import CustomerFlights from './Pages/FrontDesk/CustomerFlights';
import './styles/loader.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<PublicRoute />}>
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<AdminLogin />} />
        <Route path='/frontdesk/login' element={<FrontDeskLogin />} />
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

      <Route element={<AdminRoute />}>
        <Route path='/admin/'>
          <Route element={<AdminLayout />}>
            <Route path='dashboard' element={<AdminDashboard />} />
            <Route path='pilots' element={<AdminPilots />} />
            <Route path='airplanes' element={<AdminAirplanes />} />
            <Route path='flights' element={<AdminFlights />} />
            <Route path='airports' element={<AdminAirports />} />
            <Route path='admins' element={<Admins />} />
            <Route path='front-desks' element={<FrontDeskAgents />}/>
          </Route>
        </Route>
      </Route>

      <Route element={<FrontDeskRoute />}>
        <Route path='/frontdesk/'>
          <Route element={<FrontDeskLayout />}>
            <Route path='flights' element={<FrontDeskFlights />} />
            <Route path='search-results' element={<FrontDeskSearchResults />} />
            <Route path='booking' element={<FrontDeskBookingPage />} />
            <Route path='flights/customer' element={<CustomerFlights />} />
            <Route path='flight/'>
              <Route path='book' element={<FrontDeskSearchPage />} />
              <Route path='available' element={<FrontDeskAvailableFlights />} />
            </Route>
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
      <SideBarContextProvider>
        <RouterProvider router={router} />
      </SideBarContextProvider>
    </SearchContextProvider>
  </StrictMode>,
)
