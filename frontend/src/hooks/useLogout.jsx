import { useNavigate } from "react-router-dom";

export const useLogout = () => {
    const navigate = useNavigate();
  
    const logout = async () => {
      await fetch('/logout');
      sessionStorage.removeItem("state");
      navigate('/', { replace: true });
    };
    return logout;
};