import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const navigate = useNavigate();
  const location = useLocation(); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    console.log("Header - User loaded:", user);

    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name);
      setIsVenueManager(Boolean(user.venueManager));
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setIsVenueManager(false);
    }
  }, [location]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Holidaze</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>

          {!isLoggedIn ? (
            <Link to="/login" className="hover:underline">Login</Link>
          ) : (
            <>
              <Link to={`/profile/${userName}`} className="hover:underline">My Profile</Link>
              {isVenueManager && (
                <>
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                </>
              )}
              <button onClick={handleLogout} className="hover:underline">Logout</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
