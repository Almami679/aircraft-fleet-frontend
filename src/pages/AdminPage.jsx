import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PlaneCardForAdmin from '../components/PlaneCardForAdmin';
import './AdminPage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const storeRef = useRef(null);

  const [userData, setUserData] = useState({
    userName: '',
    wallet: 0,
    score: 0,
  });

  const [storePlanes, setStorePlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Función para obtener datos del usuario y la lista de todos los aviones
  const fetchUserDataAndStore = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      // ✅ Obtener datos del usuario
      const userResponse = await axios.get('/aircraft/hangar/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.status === 200) {
        setUserData(userResponse.data);
      }

      // ✅ Obtener todos los aviones del backend (Administración)
      const storeResponse = await axios.get('/aircraft/hangar/AllPlanes', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (storeResponse.status === 200) {
        setStorePlanes(storeResponse.data);
      }

      setLoading(false);
    } catch (err) {
      console.error('❌ Error al obtener datos:', err);
      setError('⚠️ No se pudo obtener la información.');
      setLoading(false);
    }
  };

  // ✅ Actualizar el estado de los aviones al modificar uno
  const updatePlaneState = async () => {
    try {
      fetchUserDataAndStore();
    } catch (err) {
      console.error("Error al actualizar estado del avión:", err);
    }
  };

  // 🔹 Cargar datos al montar el componente
  useEffect(() => {
    fetchUserDataAndStore();
  }, []);

  // ✅ Función para manejar el scroll automático
  useEffect(() => {
    const storeContainer = storeRef.current;
    if (!storeContainer) return;

    const handleMouseMove = (event) => {
      const { clientX } = event;
      const { left, right } = storeContainer.getBoundingClientRect();
      const edgeThreshold = 80;
      const scrollSpeed = 5;

      if (clientX < left + edgeThreshold) {
        storeContainer.scrollLeft -= scrollSpeed;
      } else if (clientX > right - edgeThreshold) {
        storeContainer.scrollLeft += scrollSpeed;
      }
    };

    storeContainer.addEventListener('mousemove', handleMouseMove);
    return () => {
      storeContainer.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  if (loading) {
    return <p>Cargando todos los aviones... ⏳</p>;
  }

  return (
    <div className="hangar-page">
      {/* ✅ Video de fondo */}
      <video autoPlay loop muted className="background-video">
        <source src="/video.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* 🔹 Cabecera fija con usuario */}
      <div className="hangar-header">
        <img
          className="store-image"
          src="/images/hangarBottom.PNG"
          alt="Store"
          onClick={() => navigate('/aircraft/hangar/user')}
        />
        <div className="user-info">
          <span className="user-name">{userData.userName}</span>
          <span className="wallet">💰 {userData.wallet}</span>
          <span className="score">🏆 {userData.score}</span>
        </div>
      </div>

      {/* ✅ Contenedor de aviones con scroll automático */}
      <div className="store-container" ref={storeRef}>
        {storePlanes.length === 0 ? (
          <div className="no-planes-message">
            <p>Aviones no disponibles en este momento.</p>
          </div>
        ) : (
          storePlanes.map((plane) => (
            <PlaneCardForAdmin
              key={plane.userId}  // ✅ Ahora usa `userId` en lugar de `id`
              user={plane}  // ✅ Pasamos el objeto completo `user`
              fetchUserData={updatePlaneState}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default StorePage;
