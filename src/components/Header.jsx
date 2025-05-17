import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { PiChartBar } from "react-icons/pi";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
      setIsLoggedIn(true);
      setUserName(user.name);
      setIsVenueManager(Boolean(user.venueManager));
      setUserAvatar(user.avatar?.url);
    } else {
      setIsLoggedIn(false);
      setUserName("");
      setIsVenueManager(false);
      setUserAvatar(null);
    }
  }, [location]);

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    navigate('/login');
  }

  return (
    <header className="flex justify-between items-center p-4 shadow-md sticky top-0 bg-white z-50 gap-4">
        {/* Logo */}
        <div className="text-xl font-montserrat font-semibold">
          <Link className="flex items-center" to="/">
            SnapBook
            <div className="h-[1rem] w-[1rem] bg-yellowMain border-2 border-black rounded-full ml-1"></div>
          </Link>
        </div>

        {/* Searchbar */}
        <input
          className="grow max-w-md border-[0.5px] border-blackMain focus:outline-none px-3 py-0.5 focus:ring-1 focus:ring-black rounded-2xl placeholder:text-xs"
          placeholder="Search for Venues..."
          type="text"
          name="searchbar"
        />
        {/* Nav */}
        <nav className="space-x-4 flex items-center">
          {!isLoggedIn ? (
            <Link to="/login" className="auth-button">
              Log in
            </Link>
          ) : (
            <>


              {/* Dashboard if venue manager */}
              {isVenueManager && (
                <Link to="/dashboard" className="flex items-center gap-1 ">
                  Dashboard <PiChartBar />
                </Link>
              )}

              {/* Avatar*/}
              <div className="flex items-center space-x-2">

                <Link to={`/profile/${userName}`} className="font-medium">
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover hover:border hover:border-black"
                  />
                )}
                </Link>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-yellowMain px-5 py-2 rounded-full text-sm font-medium"
              >
                Log out
              </button>
            </>
          )}
        </nav>
    </header>
  );
}

export default Header;
