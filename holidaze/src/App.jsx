import { Routes, Route } from 'react-router-dom';
import DetailBooking from './pages/DetailBooking';
import Venues from './pages/Venues';
import DetailVenues from './pages/DetailsVenues';
import DetailProfile from './pages/DetailsProfiles';
import LoginForm from './pages/Login';
import RegisterUser from './pages/Register';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Venues />} />
      <Route path="/details/:id" element={<DetailBooking />} />
      <Route path="Venues/:id" element={<DetailVenues />} />
      <Route path="/Profile/:profileName" element={<DetailProfile />} />
      <Route path="/Login" element={<LoginForm />} />
      <Route path="/Register" element={< RegisterUser/>} />
      <Route path="/dashboard" element={< Dashboard/>} />
    </Routes>
  );
}

export default App;
