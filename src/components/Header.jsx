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
    <header className="p-4 shadow-md">
      <div className="container flex justify-between items-center">
        <div className="text-xl font-montserrat font-semibold">
          <Link className="flex items-center" to="/">SnapBook
            <div className="h-[1rem] w-[1rem] bg-yellowMain border-2 border-black rounded-full ml-1"></div>
          </Link>
        </div>
        <input className="border-[0.5px] border-blackMain focus:outline-none px-3 py-0.5 focus:ring-1 focus:ring-black rounded-2xl placeholder:text-xs" placeholder="Search for Venues..." type="text" name="searchbar" id="" />
        <nav className="space-x-4">
          {!isLoggedIn ? (
            <Link to="/login" className="bg-yellowMain">Log in</Link>
          ) : (
            <>
              {isVenueManager && (
                <>
                  <Link to="/dashboard" className="hover:underline">Dashboard</Link>
                </>
              )}
              <Link to={`/profile/${userName}`} className="hover:underline">Profile</Link>
              <button onClick={handleLogout} className="hover:underline bg-yellowMain">Log out</button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
