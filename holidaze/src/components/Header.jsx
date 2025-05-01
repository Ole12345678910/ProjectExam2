// components/Header.jsx
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Holidaze</Link>
        </h1>
        <h2>
            <Link to="/Venues">Venue</Link>
        </h2>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/bookings" className="hover:underline">Bookings</Link>
          <Link to="/Profiles">Profiles</Link>
          {/* Add more links as needed */}
        </nav>
      </div>
    </header>
  );
}

export default Header;
