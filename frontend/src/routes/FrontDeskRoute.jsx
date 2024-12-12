import { Outlet, Navigate } from "react-router-dom";
import useFetchUserType from "../hooks/useFetchUserType";

const FrontDeskRoute = () => {
  const { user } = useFetchUserType();

  return <>
  {user === 'front-desk' && !loading ? <Outlet /> : <Navigate to="/" />}
  </>
};

export default FrontDeskRoute