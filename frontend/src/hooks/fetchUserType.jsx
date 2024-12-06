
export const fetchUserType = async () => {
    try {
      const response = await fetch('/api/user-type');
      if (response.ok) {
        const result = await response.json();
        return result.user
      } else {
        return null
      }
    } catch (error) {
        return null
    }
};