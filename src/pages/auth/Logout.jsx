import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  // React Router hook for programmatic navigation
  const navigate = useNavigate();

  useEffect(() => {
    // Remove user-related data from localStorage to "log out"
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect user to the login page after clearing data
    navigate("/login");
  }, [navigate]); // Dependency array ensures this runs once on mount

  // Simple message shown while the logout process happens
  return <p>Logging out...</p>;
}

export default Logout;
