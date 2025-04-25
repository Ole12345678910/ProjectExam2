import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // ✅ Importer BrowserRouter
import Header from './components/Header';
import Footer from './components/Footer';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter> {/* Sørg for at BrowserRouter er riktig satt opp */}
      <Header />
      <App />
      <Footer/>
    </BrowserRouter>
  </StrictMode>
);
