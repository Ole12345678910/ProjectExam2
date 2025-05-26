// Import necessary hooks and components from React Router and react-icons
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiChartBar, PiMagnifyingGlass, PiList, PiX } from "react-icons/pi";

function Header() {
  // Hook to programmatically navigate between routes
  const navigate = useNavigate();
  const location = useLocation();

  // Get the search parameter from the URL
  const params = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");

  // Update search term when the URL query changes
  useEffect(() => {
    setSearchTerm(params.get("search") || "");
  }, [location.search]);

  // Handle form submission for search
  const onSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/venues?search=${encodeURIComponent(q)}` : "/venues");
  };

  // State for authentication and user data
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);

  // Load user info from localStorage when component mounts or location changes
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (token && user.name) {
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

  // Logout function: clears localStorage and redirects to login
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // State to toggle mobile menu visibility
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="header">
        {/* Logo link to homepage */}
        <Link to="/" className="logo">
          Holidaze
          <div className="logo-dot" />
        </Link>

        {/* Desktop search bar */}
        <div className="hidden md:flex flex-1 justify-center">
          <form onSubmit={onSubmit} className="search-form">
            <button type="submit" className="search-icon" aria-label="Search">
              <PiMagnifyingGlass size={18} />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Venues…"
              className="search-input"
            />
          </form>
        </div>

        {/* Authentication area */}
        <div className="auth-wrapper">
          {!isLoggedIn ? (
            // Show login button if not logged in
            <Link to="/login" className="auth-button">
              Log in
            </Link>
          ) : (
            <>
              {/* Show dashboard link if user is a venue manager */}
              {isVenueManager && (
                <Link to="/dashboard" className="sidebar-link">
                  Dashboard <PiChartBar />
                </Link>
              )}
              {/* Profile link with avatar */}
              <Link to={`/profile/${userName}`} className="sidebar-link">
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="sidebar-avatar hover:ring-2 hover:ring-yellowMain"
                  />
                )}
              </Link>
              {/* Logout button */}
              <button onClick={handleLogout} className="auth-button">
                Log out
              </button>
            </>
          )}
        </div>

        {/* Hamburger button for mobile menu */}
        <button
          className="hamburger"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <PiList size={24} />
        </button>
      </header>

      {/* Mobile sidebar and overlay */}
      <div className="sidebar-overlay">
        {/* Transparent background to close menu when clicked */}
        <div
          className={`sidebar-backdrop ${
            menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"
          }`}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar menu */}
        <div
          className={`sidebar ${
            menuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full"
          }`}
        >
          {/* Close menu button */}
          <button
            className="close-button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <PiX size={24} />
          </button>

          {/* Search bar inside sidebar */}
          <form onSubmit={onSubmit} className="sidebar-form">
            <button
              type="submit"
              className="sidebar-search-icon"
              aria-label="Search"
            >
              <PiMagnifyingGlass size={18} />
            </button>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Venues…"
              className="sidebar-search-input"
            />
          </form>

          {/* Sidebar navigation links */}
          <ul className="sidebar-links">
            {!isLoggedIn && (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="auth-button block text-center"
                >
                  Log in
                </Link>
              </li>
            )}

            {isLoggedIn && (
              <>
                {isVenueManager && (
                  <li>
                    <Link
                      to="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="sidebar-link"
                    >
                      Dashboard <PiChartBar />
                    </Link>
                  </li>
                )}

                <li>
                  <Link
                    to={`/profile/${userName}`}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2"
                  >
                    {userAvatar && (
                      <img
                        src={userAvatar}
                        alt="Avatar"
                        className="sidebar-avatar"
                      />
                    )}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="sidebar-logout"
                  >
                    Log out
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </>
  );
}

export default Header;
