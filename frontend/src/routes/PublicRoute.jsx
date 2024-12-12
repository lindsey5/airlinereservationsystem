import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import useFetchUserType from "../hooks/useFetchUserType";

const PublicRoute = () => {
  const { user, loading } = useFetchUserType();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      console.log(user)
      if (user === 'user') {
        navigate('/user/home');
      } else if (user === 'admin') {
        navigate('/admin/dashboard');
      } else if (user === 'frontdesk') {
        navigate('/frontdesk/flights');
      }
    }
  }, [user, loading, navigate]);

  return <>{loading ? null : <Outlet />}</>;
};

export default PublicRoute;
