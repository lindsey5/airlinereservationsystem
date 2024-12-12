import useFetchUserType from "../hooks/useFetchUserType";
import { Outlet, Navigate } from "react-router-dom";

const AdminRoute = () => {
    const { user, loading } = useFetchUserType();

    return <>
    {user === 'admin' && !loading ? <Outlet /> : <Navigate to="/" />}
    </>
};

export default AdminRoute