import { fetchUserType } from "../hooks/fetchUserType";
import { useState, useEffect} from "react";
import { Outlet, Navigate } from "react-router-dom";

const PublicRoute = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        setUser(await fetchUserType())
        setLoading(false);
      };
      fetchData();
    }, []);

    if (loading) {
      return null;
    }

    if (user) {
      const navigateTo = user === 'user' ? "/user/home" : "/admin/dashboard";
      return <Navigate to={navigateTo} />;
    }

    return <Outlet />;
};

export default PublicRoute