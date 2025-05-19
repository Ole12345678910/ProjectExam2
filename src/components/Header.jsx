import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { PiChartBar, PiMagnifyingGlass, PiList, PiX } from "react-icons/pi";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();

  // Search state (sync with ?search=…)
  const params = new URLSearchParams(location.search);
  const [searchTerm, setSearchTerm] = useState(params.get("search") || "");
  useEffect(() => {
    setSearchTerm(params.get("search") || "");
  }, [location.search]);
  const onSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate(q ? `/venues?search=${encodeURIComponent(q)}` : "/venues");
  };

  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [isVenueManager, setIsVenueManager] = useState(false);
  const [userAvatar, setUserAvatar] = useState(null);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    navigate("/login");
  };

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between p-4 shadow-md sticky top-0 bg-white z-50">
        {/* Logo */}
        <Link to="/" className="text-xl font-semibold flex items-center">
          SnapBook
          <div className="ml-1 h-4 w-4 bg-yellowMain border-2 border-black rounded-full" />
        </Link>

        {/* Desktop nav & search */}
        <div className="hidden md:flex items-center flex-1 mx-4 space-x-6">
          <form onSubmit={onSubmit} className="relative flex-1">
            <PiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Venues…"
              className="w-full pl-10 pr-4 py-1 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
            />
          </form>

          {!isLoggedIn ? (
            <Link to="/login" className="auth-button">
              Log in
            </Link>
          ) : (
            <>
              {isVenueManager && (
                <Link to="/dashboard" className="flex items-center gap-1">Dashboard
                  <PiChartBar /> 
                </Link>
              )}
              <Link to={`/profile/${userName}`} className="flex items-center">
                {userAvatar && (
                  <img
                    src={userAvatar}
                    alt="Avatar"
                    className="w-8 h-8 rounded-full object-cover hover:ring-2 hover:ring-black"
                  />
                )}
                <span className="ml-2">{userName}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="bg-yellowMain px-5 py-2 rounded-full text-sm font-medium"
              >
                Log out
              </button>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
        >
          <PiList size={24} />
        </button>
      </header>

      {/* Mobile sidebar overlay */}
      <div
        className={`
          fixed inset-0 z-50 flex
          pointer-events-none
        `}
      >
        {/* Backdrop */}
        <div
          className={`
            absolute inset-0 bg-black bg-opacity-50
            transition-opacity duration-300
            ${menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0"}
          `}
          onClick={() => setMenuOpen(false)}
        />

        {/* Sidebar sliding from right */}
        <div
          className={`
            absolute right-0 top-0 h-full w-80 bg-white pt-16 px-6 pb-6
            transform transition-transform duration-300 ease-out
            ${menuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full"}
          `}
        >
          <button
            className="absolute top-4 right-4"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <PiX size={24} />
          </button>

          <form onSubmit={onSubmit} className="relative mb-6">
            <PiMagnifyingGlass
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              size={18}
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search…"
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-black"
            />
          </form>

          <ul className="space-y-4">
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
                      className="flex items-center gap-2"
                    >
                       Dashboard<PiChartBar />
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
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    {userName}
                  </Link>
                </li>

                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuOpen(false);
                    }}
                    className="bg-yellowMain px-4 py-2 rounded-full w-full"
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
