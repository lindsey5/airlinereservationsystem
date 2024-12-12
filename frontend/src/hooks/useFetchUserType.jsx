import { useEffect, useState } from "react";

const useFetchUserType = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    useEffect(() => {
      const fetchUserType = async () => {
        try {
          const response = await fetch('/api/user-type');
          if (response.ok) {
            const result = await response.json();
            setUser(result.user);
            setLoading(false);
          }
        }catch(err){
          console.error("Error: ", err);
        }
      }
      fetchUserType();
    }, [])

    return { loading, user }
};

export default useFetchUserType