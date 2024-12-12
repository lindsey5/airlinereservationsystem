import useFetchUserType from "../hooks/useFetchUserType";
import { Outlet, Navigate } from "react-router-dom";

const UserRoute = () => {
  const { user, loading} = useFetchUserType();

  return <> 
        {user === 'user' && !loading ? <Outlet /> : <Navigate to="/" />}
  </>

};

export default UserRoute