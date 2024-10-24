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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Home />} />
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
   <RouterProvider router={router} />
  </StrictMode>,
)
