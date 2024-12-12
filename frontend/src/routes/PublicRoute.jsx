import { Outlet, useNavigate } from "react-router-dom";
import useFetchUserType from "../hooks/useFetchUserType";

const PublicRoute = () => {
  const { user, loading} = useFetchUserType();
  const navigate = useNavigate();
    return <> 
    {user && !loading ? user === 'user' ? navigate('/user/home') : user === 'admin' ? navigate("/admin/dashboard") : navigate('/frontdesk/flights') : <Outlet />}
    </>
};

export default PublicRoute