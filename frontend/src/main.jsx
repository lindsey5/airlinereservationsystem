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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
      <Route path='/User/Login' element={<UserLogin />} />
      <Route path='/Admin/'>
        <Route element={<AdminLayout />}>

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
