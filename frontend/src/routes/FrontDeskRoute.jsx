import { Outlet, Navigate } from "react-router-dom";
import useFetchUserType from "../hooks/useFetchUserType";

const FrontDeskRoute = () => {
  const { user, loading } = useFetchUserType();

  if (loading) {
    return null;
  }

  return user === 'front-desk' ? <Outlet /> : <Navigate to="/" />;
};

export default FrontDeskRoute
