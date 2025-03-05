import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PlaneSell from '../components/PlaneSell';
import './StorePage.css';

const StorePage = () => {
  const navigate = useNavigate();
  const storeRef = useRef(null); // ✅ Referencia al contenedor de la tienda

  const [userData, setUserData] = useState({
    userName: '',
    wallet: 0,
    score: 0,
  });

  const [storePlanes, setStorePlanes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // ✅ Función para obtener datos del usuario y la tienda
  const fetchUserDataAndStore = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const userResponse = await axios.get('/aircraft/hangar/user', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (userResponse.status === 200) {
        setUserData(userResponse.data);
      }

      const storeResponse = await axios.get('/aircraft/store/planes', {
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

  // ✅ Función para añadir 1000 créditos al usuario
  const handleAddCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/auth/login');
        return;
      }

      const response = await axios.post(
        '/aircraft/store/addCredits',
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        setUserData(response.data);
      }
    } catch (err) {
      console.error('❌ Error al añadir créditos:', err);
      setError('⚠️ No se pudieron añadir créditos.');
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
      const { left, right, width } = storeContainer.getBoundingClientRect();
      const edgeThreshold = 80; // 🔹 Distancia en píxeles para activar el scroll
      const scrollSpeed = 5; // 🔹 Velocidad del scroll

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
    return <p>Cargando tienda... ⏳</p>;
  }

  return (
    <div className="hangar-page">
      {/* ✅ Video de fondo de la tienda */}
      <video autoPlay loop muted className="background-video">
        <source src="/videos/store.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* 🔹 Cabecera fija con tienda y usuario */}
      <div className="hangar-header">
        <img
          className="store-image"
          src="/images/hangarBottom.PNG"
          alt="Store"
          onClick={() => navigate('/aircraft/hangar/user')}
        />
        <div className="user-info-container">
            <div className="user-info">
              <span className="user-name">{userData.userName}</span>
              <span className="wallet">💰 {userData.wallet}</span>
              <span className="score">🏆 {userData.score}</span>
              {/* ✅ Botón dentro del mismo casillero */}
                          <button className="add-credits-btn" onClick={handleAddCredits}>
                            ➕ Añadir creditos
                          </button>
            </div>
          </div>
        </div>

      {/* ✅ Contenedor de aviones con scroll automático */}
      <div className="store-container">
        {storePlanes.length === 0 ? (
          <div className="no-planes-message">
            <p>Tienda cerrada en estos momentos.</p>
          </div>
        ) : (
          storePlanes.map((plane) => <PlaneSell key={plane.id} plane={plane} />)
        )}
      </div>
    </div>
  );
};

export default StorePage;
