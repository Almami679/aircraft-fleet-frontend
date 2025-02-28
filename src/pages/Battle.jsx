import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { videoMap } from '../constants/videoMap';
import PlaneCard from '../components/PlaneCard';
import './HangarPlanesPage.css';

const Battle = () => {
  const navigate = useNavigate();

  // Estado del usuario
  const [userData, setUserData] = useState({
    userName: '',
    wallet: 0,
    score: 0,
  });

  // Estado del avión seleccionado por el usuario
  const [selectedPlayerPlane, setSelectedPlayerPlane] = useState(null);

  // Estado del oponente
  const [opponentData, setOpponentData] = useState(null);
  const [loadingOpponent, setLoadingOpponent] = useState(true);
  const [error, setError] = useState('');

  // Estado para la hora del día y clima del hangar
  const [timeOfDay, setTimeOfDay] = useState(null);

  // 🔹 Mapeo de iconos de clima
  const weatherIcons = {
    DESPEJADO: '☀️',
    NUBLADO: '☁️',
    TORMENTA: '⛈️'
  };

  // ✅ Obtener el token desde localStorage
  const getToken = () => localStorage.getItem('token');

  useEffect(() => {
      const fetchUserData = async () => {
        const token = getToken();
        if (!token) {
          navigate("/auth/login");
          return;
        }

        try {
          const response = await axios.get("/aircraft/hangar/user", {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (response.status === 200) {
            const data = response.data;
            console.log("✅ Datos del usuario obtenidos:", data);
            setUserData({
              userName: data.userName || "",
              wallet: data.wallet || 0,
              score: data.score || 0,
            });
            setTimeOfDay(data.hangar?.timeOfDay || "DAY");
          }
        } catch (err) {
          console.error("❌ Error al obtener datos del usuario:", err);
        }
      };

      fetchUserData();
    }, [navigate]);

  // Comprobar id de avion guardado
  useEffect(() => {
      const storedPlayerPlane = localStorage.getItem("selectedPlayerPlane");

      if (storedPlayerPlane) {
          console.log("📌 Avión seleccionado encontrado en localStorage:", JSON.parse(storedPlayerPlane));
          setSelectedPlayerPlane(JSON.parse(storedPlayerPlane));
      } else {
          console.error("❌ No se encontró el avión seleccionado en localStorage.");
      }
  // 🔹 **Buscar un oponente al entrar en la batalla**
    const fetchOpponent = async () => {
      const token = getToken();
      if (!token) {
        navigate('/auth/login');
        return;
      }

      try {
        const response = await axios.get('/aircraft/battles/find-opponent', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          console.log("🎯 Oponente encontrado:", response.data);

          // 🔹 Guardar datos en `localStorage` para BattleSimulationPage
          localStorage.setItem("opponentData", JSON.stringify(opponentData));
          setOpponentData(response.data);
          console.log(localStorage.getItem("selectedPlayerPlane"));
          console.log(localStorage.getItem("opponentData"));

        }
      } catch (err) {
        console.error("❌ Error al encontrar oponente:", err);
        setError("No hay oponentes disponibles en este momento.");
      } finally {
        setLoadingOpponent(false);
      }
    };

    fetchOpponent();
  }, []);

  // 🔹 **Cargar datos del usuario**
  useEffect(() => {
      const fetchOpponent = async () => {
        const token = getToken();
        if (!token) {
          navigate('/auth/login');
          return;
        }

        try {
          const response = await axios.get('/aircraft/battles/find-opponent', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.status === 200) {
            console.log("🎯 Oponente encontrado:", response.data);

            // ✅ Guardamos `response.data` directamente en `localStorage`
            localStorage.setItem("opponentData", JSON.stringify(response.data));
            setOpponentData(response.data); // 🔹 Ahora actualizamos el estado

            console.log("📌 selectedPlayerPlane en localStorage:", localStorage.getItem("selectedPlayerPlane"));
            console.log("📌 opponentData en localStorage:", localStorage.getItem("opponentData"));
          }
        } catch (err) {
          console.error("❌ Error al encontrar oponente:", err);
          setError("No hay oponentes disponibles en este momento.");
        } finally {
          setLoadingOpponent(false);
        }
      };

      fetchOpponent();
  }, []);



  // 🔹 **Normalizar valores solo si están definidos**
  const normalizedTimeOfDay = timeOfDay ? timeOfDay.trim().toUpperCase() : "DAY";

  // 🔹 **Seleccionar el video de fondo según `videoMap` y obtener el clima**
  const { backgroundVideo, displayedWeather } = useMemo(() => {
    const availableWeathers = Object.keys(videoMap[normalizedTimeOfDay] || {});
    const randomWeather = availableWeathers[Math.floor(Math.random() * availableWeathers.length)] || "DESPEJADO";

    return {
      backgroundVideo: videoMap[normalizedTimeOfDay]?.[randomWeather] || '/hangarStatus/day-clear.MOV',
      displayedWeather: randomWeather
    };
  }, [normalizedTimeOfDay]);

  console.log("🎥 Video seleccionado:", backgroundVideo);
  console.log("🌦️ Clima visualizado según video:", displayedWeather);


  // ✅ **Función para retirarse**
  const handleRetreat = () => {
    console.log("❌ Retirándose de la batalla...");
    navigate("/aircraft/hangar/user");
  };

  if (loadingOpponent) {
    return <p>Cargando batalla... ⏳</p>;
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

        {/* 🔹 Casillero de clima basado en `videoMap` */}
        <div className="weather-box">
          🌍 {normalizedTimeOfDay === "DAY" ? "Día" : "Noche"} - {weatherIcons[displayedWeather] || '❓'} {displayedWeather}
        </div>

        <div className="user-info">
          <span className="user-name">{userData.userName}</span>
          <span className="wallet">💰 : {userData.wallet}</span>
          <span className="score">🏆 : {userData.score}</span>
        </div>
      </div>

      {/* Contenido de la batalla: Solo muestra el avión del oponente */}
      <div className="hangar-content">
        {error ? (
          <div className="no-planes-message">
            <p>{error}</p>
            <button className="retreat-button" onClick={handleRetreat}>
              ❌ Volver al Hangar
            </button>
          </div>
        ) : (
          <div className="planes-container">

            <PlaneCard
              plane={{
                ...opponentData.plane,
                pilotName: opponentData.username,
                pilotScore: opponentData.score,
                model: opponentData.plane.model
              }}
              isOpponent={true}
              selectedPlayerPlane={selectedPlayerPlane}  // 🔹 Enviamos nuestro avión
              opponentData={opponentData}  // 🔹 Enviamos el oponente
            />
          </div>
        )}
      </div>


    </div>
  );
};

export default Battle;
