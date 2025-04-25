// components/Header.jsx
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-xl font-bold">
          <Link to="/">Holidaze</Link>
        </h1>
        <nav className="space-x-4">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/bookings" className="hover:underline">Bookings</Link>
          {/* Add more links as needed */}
        </nav>
      </div>
    </header>
  );
}

export default Footer;
