// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService'; // ✅ Servicio de login
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // Estado para usuario y contraseña
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await login(username, password);
      console.log('✅ DEBUG - Login exitoso:', response.data);

      // 🔹 Extraemos los datos recibidos del backend
      const { token, userName, role } = response.data;

      // 🔹 Guardamos los datos en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('role', role);

      console.log("🔹 Rol del usuario logueado:", role);

      // 🔹 Redirigir según el rol
      if (role === "ADMIN") {
        navigate("/aircraft/hangar/AllPlanes"); // ✅ Admins van a la gestión de aviones
      } else {
        navigate("/aircraft/hangar/user"); // ✅ Usuarios normales van a su hangar
      }
    } catch (err) {
      console.error("❌ Error en el login:", err);
      setError(err.response?.data?.message || "⚠️ Error al iniciar sesión");
    }
  };

  return (
    <div className="login-container">
      {/* ✅ Video de fondo */}
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
