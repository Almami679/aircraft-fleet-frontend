// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../services/authService'; // Tu servicio de registro
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();

  // Igual que en login, usamos [username, setUsername]
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Llamamos a la función register(username, password)
      await register(username, password);

      // Redirigimos al login (asegúrate de que exista <Route path="/auth/login" ...>)
      navigate('/auth/login');
    } catch (err) {
        console.log('DEBUG:', err.response); // <-- Nuevo
        setError(err.response?.data?.message || 'Error al registrar usuario');
      }

  };

  return (
    <div className="register-container">
      <video autoPlay loop muted className="background-video">
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>

      <div className="form-container">
        <h2>Registro</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Registrarme</button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
