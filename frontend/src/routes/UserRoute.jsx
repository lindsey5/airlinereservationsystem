import { fetchUserType } from "../hooks/fetchUserType";
import { useState, useEffect} from "react";
import { Outlet, Navigate } from "react-router-dom";

export const UserRoute = () => {
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

    return user === 'user' ? <Outlet /> : <Navigate to="/" />;
};