import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { videoMap } from '../constants/videoMap';
import { getPlaneImage } from '../constants/planeMap';
import PlaneCard from '../components/PlaneCard';
import './HangarPlanesPage.css';

const HangarPlanesPage = () => {
  const navigate = useNavigate();

  // Datos del usuario
  const [userName, setUserName] = useState('');
  const [wallet, setWallet] = useState(0);
  const [score, setScore] = useState(0);

  // Datos del hangar
  const [timeOfDay, setTimeOfDay] = useState(null);
  const [weather, setWeather] = useState(null);
  const [planes, setPlanes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Error (si ocurre)
  const [error, setError] = useState('');

  // 🔹 **Función para obtener datos del usuario y su hangar**
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

      setUserName(data.userName || '');
      setWallet(data.wallet || 0);
      setScore(data.score || 0);

      if (data.hangar) {
        setTimeOfDay(data.hangar.timeOfDay);
        setWeather(data.hangar.weather);
        setPlanes(data.hangar.planes || []);
      } else {
        setPlanes([]);
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

  // 🔹 **Acciones sobre los aviones**
  const handleRepair = async (planeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      await axios.post(`/aircraft/hangar/repair/${planeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserData(); // Recargar datos después de la acción
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al reparar el avión.');
    }
  };

  const handleRefuel = async (planeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      await axios.post(`/aircraft/hangar/refuel/${planeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchUserData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al repostar el avión.');
    }
  };

  const handleBattle = async (planeId) => {
    try {
      console.log('Ir a batalla con avión ID:', planeId);
      // navigate(`/battle/${planeId}`);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al iniciar la batalla.');
    }
  };

  // 🔹 **Normalizar valores solo si están definidos**
  const normalizedTimeOfDay = timeOfDay ? timeOfDay.trim().toUpperCase() : "DAY";
  const normalizedWeather = weather ? weather.trim().toUpperCase() : "CLEAR";

  // 🔹 **Seleccionar el video de fondo según el clima y la hora del día**
  const backgroundVideo = useMemo(() => {
    if (!videoMap[normalizedTimeOfDay]) {
      console.warn(`⚠️ No se encontró '${normalizedTimeOfDay}' en videoMap.`);
    }
    if (!videoMap[normalizedTimeOfDay]?.[normalizedWeather]) {
      console.warn(`⚠️ No se encontró '${normalizedWeather}' para '${normalizedTimeOfDay}' en videoMap.`);
    }

    return videoMap[normalizedTimeOfDay]?.[normalizedWeather] || '/hangarStatus/day-clear.MOV';
  }, [normalizedTimeOfDay, normalizedWeather]);

  console.log("🎥 Video seleccionado:", backgroundVideo);

  // 🔹 **Esperar a que se carguen los datos antes de renderizar**
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
            onClick={() => navigate('/store/planes')}
          />

          {/* Imagen del título (centrado) */}
          <div className="hangar-title-container">
            <img
              src="/images/imagenesfront/tituloHangar.png"
              alt="Hangar"
              className="hangar-title"
            />
          </div>

          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="wallet">💰 : {wallet}</span>
            <span className="score">🏆 : {score}</span>
          </div>
        </div>

        {/* Contenido de los aviones con scroll independiente */}
        <div className="hangar-content">
          {planes.length === 0 ? (
            <div className="no-planes-message">
              <p>No tienes aviones en tu hangar</p>
            </div>
          ) : (
            <div className="planes-container">
              {planes.map((plane) => (
                <PlaneCard
                  key={plane.id}
                  plane={plane}
                  handleRepair={handleRepair}
                  handleRefuel={handleRefuel}
                  handleBattle={handleBattle}
                  fetchUserData={fetchUserData}
                />
              ))}
            </div>
          )}
        </div>
      </div> // 🔹 **Cierre correcto de `<div className="hangar-page">`**
    );
  };

  export default HangarPlanesPage;





