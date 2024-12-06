import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { SearchContext } from "../Context/SearchContext";

export const useLogout = () => {
    const navigate = useNavigate();
    const { dispatch } = useContext(SearchContext);
  
    const logout = async () => {
      await fetch('/logout');
      dispatch({type: 'RESET'});
      navigate('/', { replace: true });
    };
    return logout;
};