import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path='/user/login' element={<UserLogin />} />


      <Route path='/admin/'>
        <Route element={<AdminLayout />}>
          <Route path='dashboard' element={<AdminDashboard />}/>
          <Route path='pilots' element={<AdminPilots />} />
          <Route path='airplanes' element={<AdminAirplanes />} />
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
