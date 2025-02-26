import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HangarPlanesPage from './pages/HangarPlanesPage';
import StorePage from './pages/StorePage';
import Battle from './pages/Battle';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta absoluta con /auth/login */}
        <Route path="/auth/login" element={<LoginPage />} />
        {/* Ruta absoluta con /auth/register */}
        <Route path="/auth/register" element={<RegisterPage />} />
        {/* Ruta absoluta con /aircraft/hangar/planes */}
        <Route path="/aircraft/hangar/user" element={<HangarPlanesPage />} />
        <Route path="/aircraft/store/planes" element={<StorePage />} />
        <Route path="/battle" element={<Battle />} />
      </Routes>
    </Router>
  );
}

export default App;
