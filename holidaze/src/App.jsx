import { Routes, Route } from 'react-router-dom';
import Bookings from './components/Bookings';
import DetailBooking from './pages/DetailBooking';
import Venues from './pages/Venues';
import DetailVenues from './pages/DetailsVenues';
import Profiles from './pages/Profiles';
import DetailProfile from './pages/DetailsProfiles';

function App() {
  return (
    <Routes>
      <Route path="/Venues" element={<Venues />} />
      <Route path="/" element={<Bookings />} />
      <Route path="/details/:id" element={<DetailBooking />} />
      <Route path="Venues/:id" element={<DetailVenues />} />
      <Route path="/Profiles" element={<Profiles />} />
      <Route path="/Profile/:profileName" element={<DetailProfile />} />
    </Routes>
  );
}

export default App;
