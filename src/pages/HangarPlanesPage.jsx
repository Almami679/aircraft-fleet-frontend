import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { videoMap } from '../constants/videoMap';
import PlaneCard from '../components/PlaneCard';
import './HangarPlanesPage.css';

const HangarPlanesPage = () => {
  const navigate = useNavigate();

  // Datos del usuario
  const [userData, setUserData] = useState({
    userName: '',
    wallet: 0,
    score: 0,
    planes: []
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Estado para la hora del día y clima del hangar
  const [timeOfDay, setTimeOfDay] = useState(null);

  // Mapeo de iconos de clima
  const weatherIcons = {
    DESPEJADO: '☀️',
    NUBLADO: '☁️',
    TORMENTA: '⛈️'
  };

  // 🔹 **Función para obtener datos completos del usuario y su hangar**
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await axios.get('/aircraft/hangar/user', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const data = response.data;

      setUserData({
        userName: data.userName || '',
        wallet: data.wallet || 0,
        score: data.score || 0,
        planes: data.hangar?.planes || []
      });

      if (data.hangar) {
        setTimeOfDay(data.hangar.timeOfDay); // 🔹 Solo guardamos la hora del día
      }

      setLoading(false);
    } catch (err) {
      console.error("Error al obtener usuario:", err);
      setError(err.response?.data?.message || "Error al obtener los datos del usuario");
      setLoading(false);
    }
  };

  // 🔹 **Cargar los datos cuando el componente se monta**
  useEffect(() => {
    fetchUserData();
  }, []);

  // 🔹 **Acción para actualizar solo los aviones Y el wallet después de reparar/repostar**
  const updatePlaneState = async () => {
    try {
      fetchUserData(); // 🔹 Recargar TODO (wallet y aviones)
    } catch (err) {
      console.error("Error al actualizar estado del avión:", err);
    }
  };

  // 🔹 **Normalizar valores solo si están definidos**
  const normalizedTimeOfDay = timeOfDay ? timeOfDay.trim().toUpperCase() : "DAY";

  // 🔹 **Seleccionar el video de fondo según `videoMap`**
  const backgroundVideo = useMemo(() => {
    // 🔹 Seleccionar aleatoriamente un clima del mapa si está disponible
    const availableWeathers = Object.keys(videoMap[normalizedTimeOfDay] || {});
    const randomWeather = availableWeathers[Math.floor(Math.random() * availableWeathers.length)] || "DESPEJADO";
    return videoMap[normalizedTimeOfDay]?.[randomWeather] || '/hangarStatus/day-clear.MOV';
  }, [normalizedTimeOfDay]);

  // 🔹 **Obtener el clima mostrado en pantalla a partir del video de fondo**
  const displayedWeather = useMemo(() => {
    return Object.keys(videoMap[normalizedTimeOfDay] || {}).find(
      key => videoMap[normalizedTimeOfDay][key] === backgroundVideo
    ) || "DESCONOCIDO";
  }, [backgroundVideo]);

  console.log("🎥 Video seleccionado:", backgroundVideo);
  console.log("🌦️ Clima visualizado según video:", displayedWeather);

  if (loading) {
    console.warn("⏳ Esperando datos del hangar...");
    return <p>Cargando hangar...</p>;
  }

  return (
    <div className="hangar-page">
      {/* Video de fondo */}
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* Cabecera fija */}
      <div className="hangar-header">
        <img
          className="store-image"
          src="/images/imagenesfront/storeIcon.PNG"
          alt="Store"
          onClick={() => navigate('/aircraft/store/planes')}
        />

        {/* Casillero de clima basado en `videoMap` */}
        <div className="weather-box">
          <span>Clima: {weatherIcons[displayedWeather] || '❓'} {displayedWeather}</span>
        </div>

        <div className="user-info">
          <span className="user-name">{userData.userName}</span>
          <span className="wallet">💰 : {userData.wallet}</span>
          <span className="score">🏆 : {userData.score}</span>
        </div>
      </div>

      {/* Contenido de los aviones con scroll independiente */}
      <div className="hangar-content">
        {userData.planes.length === 0 ? (
          <div className="no-planes-message">
            <p>COMPRATE AVIONES</p>
                <p>(o no tienes, o te los han destruido)</p>
          </div>
        ) : (
          <div className="planes-container">
            {userData.planes.map((plane) => (
              <PlaneCard
                key={plane.id}
                plane={plane}
                fetchUserData={updatePlaneState} // 🔹 Ahora actualiza también el wallet
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HangarPlanesPage;
