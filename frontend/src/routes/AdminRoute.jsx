import { Outlet, Navigate } from "react-router-dom";
import useFetchUserType from "../hooks/useFetchUserType";

const AdminRoute = () => {
  const { user, loading } = useFetchUserType();

  if (loading) {
    return null;
  }

  return user === 'admin' ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute;
