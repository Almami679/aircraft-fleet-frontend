import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { videoMap } from '../constants/videoMap';
import PlaneCard from '../components/PlaneCard';
import './HangarPlanesPage.css';

const HangarPlanesPage = () => {
  const navigate = useNavigate();

  // Datos del usuario
  const [userName, setUserName] = useState('');
  const [wallet, setWallet] = useState(0);
  const [score, setScore] = useState(0);

  // Datos del hangar
  const [timeOfDay, setTimeOfDay] = useState('');
  const [weather, setWeather] = useState('');
  const [planes, setPlanes] = useState([]);

  // Error
  const [error, setError] = useState('');

  // Cargar datos del usuario + hangar desde /user
  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await axios.get('http://localhost:8080/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('📡 Datos recibidos del backend:', response.data); // 👈 Debug

      const data = response.data;

      // Datos del usuario
      setUserName(data.userName || '');
      setWallet(data.wallet || 0);
      setScore(data.score || 0);

      // Datos del hangar
      if (data.hangar) {
        setTimeOfDay(data.hangar.timeOfDay || '');
        setWeather(data.hangar.weather || '');
        setPlanes(data.hangar.planes || []);
      } else {
        setPlanes([]);
      }
    } catch (err) {
      console.error('❌ Error al obtener el usuario:', err);
      setError(err.response?.data?.message || 'Error al obtener datos del usuario.');
    }
  };

  // Llamada cuando se monta el componente
  useEffect(() => {
    fetchUserData();
  }, []);

  // Acciones sobre los aviones
  const handleRepair = async (planeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }
      await axios.post(`http://localhost:8080/aircraft/hangar/repair/${planeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserData();
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
      await axios.post(`http://localhost:8080/aircraft/hangar/refuel/${planeId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUserData();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error al repostar el avión.');
    }
  };

  const handleBattle = async (planeId) => {
    console.log('🛩 Ir a batalla con avión ID:', planeId);
  };

  // Video de fondo según timeOfDay + weather
  const backgroundVideo = videoMap[timeOfDay]?.[weather] || '/hangarStatus/day-clear.MOV';

  return (
    <div className="hangar-container">
      <video autoPlay loop muted className="background-video">
        <source src={backgroundVideo} type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* Cabecera con imagen Store + datos del usuario */}
      <div className="hangar-header">
        <img
          className="store-image"
          src="/images/storeIcon.PNG"
          alt="Store"
          onClick={() => navigate('/store/planes')}
        />

        <div className="user-info">
          <span className="user-name">{userName}</span>
          <span className="wallet">Wallet: {wallet}</span>
          <span className="score">Score: {score}</span>
        </div>
      </div>

      <div className="hangar-content">
        <img
          src="/images/tituloHangar.png"
          alt="Mi Hangar"
          className="hangar-title"
        />

        {error && (
          <p style={{ color: 'red' }}>{error}</p>
        )}

        {/* Lista de aviones o mensaje si no hay */}
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
                onRepair={handleRepair}
                onRefuel={handleRefuel}
                onBattle={handleBattle}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HangarPlanesPage;
