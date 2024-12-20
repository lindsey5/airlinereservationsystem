import { useContext } from "react";
import { SearchContext } from "../Context/SearchContext";

export const useLogout = (url) => {
    const { dispatch } = useContext(SearchContext);
  
    const logout = async () => {
      await fetch('/logout');
      dispatch({type: 'RESET'});
      window.location.href = url; 
    };
    return logout;
};