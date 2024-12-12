import { Outlet, Navigate } from "react-router-dom";
import useFetchUserType from "../hooks/useFetchUserType";

const UserRoute = () => {
  const { user, loading } = useFetchUserType();

  if (loading) {
    return null; 
  }

  // If user is not 'user', redirect them
  return user === 'user' ? <Outlet /> : <Navigate to="/" />;
};

export default UserRoute;
