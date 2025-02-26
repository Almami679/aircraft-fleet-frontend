// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // Tu servicio de login
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // Usamos [username, setUsername] para el usuario
  const [username, setUsername] = useState('');
  // Usamos [password, setPassword] para la contraseña
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(username, password);
        console.log('DEBUG - Login exitoso:', response.data);

        // Suponiendo que el backend retorna { token, userName, role }
        const { token, userName, role } = response.data;

        // Guarda el token en localStorage (o Context, Redux, etc.)
        localStorage.setItem('token', token);
        localStorage.setItem('userName', userName);
        localStorage.setItem('role', role);

        // Redirige a /aircraft/hangar/planes
        navigate('/aircraft/hangar/user');
    } catch (err) {
      // Mostramos el mensaje de error del backend o uno genérico
      setError(err.response?.data?.message || 'Error al iniciar sesión');
    }
  };

  return (
    <div className="login-container">
      <video autoPlay loop muted className="background-video">
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>

      <div className="form-container">
        <h2>Iniciar Sesión</h2>
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
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

          <button type="submit">Iniciar Sesión</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
