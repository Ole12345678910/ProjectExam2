import { Routes, Route, useLocation } from 'react-router-dom';

import Venues from './pages/venue/Venues';
import DetailVenues from './pages/venue/DetailsVenues';
import DetailProfile from './pages/profile/DetailsProfiles';
import LoginForm from './pages/auth/Login';
import RegisterUser from './pages/auth/Register';
import Dashboard from './pages/profile/Dashboard';
import HomePage from './pages/home/Home';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  const location = useLocation();
  const path = location.pathname.toLowerCase().replace(/\/$/, "");
  const noHeaderFooterPaths = ['/login', '/register'];
  const hideHeaderFooter = noHeaderFooterPaths.includes(path);
  return (
    <>
      {!hideHeaderFooter && <Header />}
      
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Venues/:id" element={<DetailVenues />} />
        <Route path="/Profile/:profileName" element={<DetailProfile />} />
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Register" element={<RegisterUser />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/venues" element={<Venues />} />
      </Routes>
      
      {!hideHeaderFooter && <Footer />}
    </>
  );
}

export default App;
