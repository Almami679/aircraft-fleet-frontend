import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./BattleSimulationPage.css";

const BattleSimulationPage = () => {
  const navigate = useNavigate();

  // Estados
  const [userData, setUserData] = useState({
    userName: '',
    wallet: 0,
    score: 0,
  });
  const [playerPlaneId, setPlayerPlaneId] = useState(null);
  const [opponentData, setOpponentData] = useState(null);
  const [battleResult, setBattleResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [timeOfDay, setTimeOfDay] = useState(null);

  // 🔹 Mapeo de iconos de clima
  const weatherIcons = {
    DESPEJADO: "☀️",
    NUBLADO: "☁️",
    TORMENTA: "⛈️",
  };

  // ✅ Obtener el token desde localStorage
  const getToken = () => localStorage.getItem("token");

  // ✅ Cargar datos desde localStorage
  useEffect(() => {
    const storedPlayerPlane = localStorage.getItem("selectedPlayerPlane");
    const storedOpponent = localStorage.getItem("opponentData");

    if (!storedPlayerPlane || !storedOpponent) {
      setError("⚠️ Datos insuficientes para iniciar la batalla.");
      setLoading(false);
      return;
    }

    const playerPlane = JSON.parse(storedPlayerPlane);
    const opponent = JSON.parse(storedOpponent);

    console.log("✅ Debug - Avión del jugador:", playerPlane);
    console.log("✅ Debug - Oponente:", opponent);

    if (!playerPlane?.id) {
      console.error("❌ Error: ID del avión del jugador es undefined.");
      setError("No se pudo obtener el avión del jugador.");
      setLoading(false);
      return;
    }

    if (!opponent) {
      console.error("❌ Error: No se obtuvo el oponente.");
      setError("No se pudo obtener el oponente.");
      setLoading(false);
      return;
    }

    setPlayerPlaneId(playerPlane.id);
    setOpponentData(opponent);
  }, []);

  // ✅ Cargar datos del usuario y el clima
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

  // ✅ Iniciar batalla solo si los datos son válidos
  useEffect(() => {
    if (!playerPlaneId || !opponentData) return;

    const startBattle = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }

        console.log("🚀 Enviando datos a backend: ", playerPlaneId, opponentData);

        const response = await axios.post(
          `/aircraft/battles/start/${playerPlaneId}`,
          opponentData,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.status === 200) {
          console.log("🏆 Batalla iniciada:", response.data);
          setBattleResult(response.data);
        }
      } catch (err) {
        console.error("❌ Error al iniciar la batalla:", err);
        setError("⚠️ No se pudo iniciar la batalla.");
      } finally {
        setLoading(false);
      }
    };

    startBattle();
  }, [playerPlaneId, opponentData, navigate]);

  if (loading) return <p>⏳ Simulando batalla...</p>;
  if (error) return <p className="error-box">{error}</p>;

  return (
    <div className="hangar-page">
      {/* ✅ Video de fondo fijo a cielo.mp4 */}
      <video autoPlay loop muted className="background-video">
        <source src="cielo.mp4" type="video/mp4" />
        Tu navegador no soporta el elemento <code>video</code>.
      </video>

      {/* 🔹 Cabecera fija con tienda, clima y usuario */}
      <div className="hangar-header">
        <img
          className="store-image"
          src="/images/imagenesfront/storeIcon.PNG"
          alt="Store"
          onClick={() => navigate("/store/planes")}
        />

        {/* 🔹 Casillero de clima basado en `videoMap` */}
        <div className="weather-box">
          🌍 {timeOfDay === "DAY" ? "Día" : "Noche"} - {weatherIcons["DESPEJADO"] || "❓"} DESPEJADO
        </div>

        <div className="user-info">
          <span className="user-name">{userData.userName}</span>
          <span className="wallet">💰 : {userData.wallet}</span>
          <span className="score">🏆 : {userData.score}</span>
        </div>
      </div>

      {/* 🔹 Contenedor de batalla con video y resultado */}
      <div className="battle-content">
        {battleResult ? (
          <div className="battle-result-box">
            <h2>🏆 ¡Ganador: {battleResult.winnerUsername}!</h2>
            <button onClick={() => navigate("/aircraft/hangar/user")} className="return-button">
              🔙 Volver al Hangar
            </button>
          </div>
        ) : (
          <div className="battle-video-box">
            <video autoPlay muted className="battle-video">
              <source src="battle.mp4" type="video/mp4" />
              Tu navegador no soporta el elemento <code>video</code>.
            </video>
          </div>
        )}
      </div>
    </div>
  );
};

export default BattleSimulationPage;
