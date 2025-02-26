import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Hook de navegación
import { getPlaneImage } from "../constants/planeMap";
import { accessoryMap } from "../constants/accessoryMap"; // ✅ Importamos el map de accesorios
import "./PlaneCard.css";

const PlaneCard = ({ plane, fetchUserData, isOpponent = false }) => {
  const navigate = useNavigate();

  const [accessories, setAccessories] = useState([]);
  const [selectedAccessory, setSelectedAccessory] = useState("");
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [buyingAccessory, setBuyingAccessory] = useState(false);
  const [updatingPlane, setUpdatingPlane] = useState(false);
  const [currentPlane, setCurrentPlane] = useState(plane);

  useEffect(() => {
    setCurrentPlane(plane);
  }, [plane]);

  useEffect(() => {
    const fetchAccessories = async () => {
      setLoadingAccessories(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axios.get("/aircraft/store/accessories", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setAccessories(response.data);
        }
      } catch (error) {
        console.error("❌ Error al obtener accesorios:", error);
      } finally {
        setLoadingAccessories(false);
      }
    };

    if (!isOpponent) {
      fetchAccessories();
    }
  }, [isOpponent]);

  // ✅ Función para ejecutar acciones (reparar, repostar, vender)
  const handlePlaneAction = async (planeId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `/aircraft/hangar/update-plane/${planeId}`,
        null,
        { headers: { Authorization: `Bearer ${token}` }, params: { action } }
      );

      fetchUserData(); // Recargar los datos después de la acción
    } catch (error) {
      console.error(`❌ Error en acción ${action}:`, error);
      alert(`No se pudo realizar la acción: ${action}`);
    }
  };

  // ✅ Función para comprar y equipar un accesorio
  const handleBuyAccessory = async () => {
    if (!selectedAccessory) {
      alert("Selecciona un accesorio antes de comprarlo.");
      return;
    }

    // 🔹 Extraer solo el nombre del accesorio sin el precio
    const accessoryName = selectedAccessory.split(" - ")[0];

    // 🔹 Convertir el nombre en `enumName` usando `accessoryMap`
    const enumName = accessoryMap[accessoryName];

    if (!enumName) {
      alert("Error: No se encontró el accesorio en el sistema.");
      return;
    }

    setBuyingAccessory(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `/aircraft/store/buy/accessory`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { planeId: plane.id, planeAccessory: enumName },
        }
      );

      alert("Accesorio comprado y equipado correctamente.");
      fetchUserData(); // 🔹 Actualizar datos tras la compra
    } catch (error) {
      console.error("❌ Error al comprar accesorio:", error);
      alert("No se pudo comprar el accesorio. Verifica tu saldo.");
    } finally {
      setBuyingAccessory(false);
    }
  };

  // ✅ Función para iniciar una batalla
  const handleBattle = () => {
    console.log(`⚔️ Entrando en batalla con avión ID: ${plane.id}`);
    navigate("/battle", { state: { selectedPlaneId: plane.id } });
  };

  // ✅ Función para aceptar la batalla (solo en oponentes)
  const handleAcceptBattle = () => {
    console.log(`⚔️ Aceptando batalla contra avión ID: ${plane.id}`);
  };

  // ✅ Función para retirarse (solo en oponentes)
  const handleRetreat = () => {
    console.log("❌ Retirándose de la batalla...");
    navigate("/aircraft/hangar/user");
  };

  return (
    <div className="plane-card">
      {/* ✅ Si NO es un oponente, se muestra el botón de vender */}
      {!isOpponent && (
        <button
          className="sell-button"
          onClick={() => handlePlaneAction(plane.id, "SELL")}
          disabled={updatingPlane}
        >
          💸 Vender avión 💸
        </button>
      )}

      {/* ✅ Imagen del avión */}
      <img src={getPlaneImage(currentPlane)} alt={plane.name} className="plane-image" />
      <h3 className="plane-name">{plane.name}</h3>

      {/* ✅ Mostrar piloto y puntaje (solo en oponentes) */}
      {isOpponent && (
        <p className="pilot-info">
          ✈️ <b>Piloto:</b> {plane.pilotName} / 🏆 <b>Score:</b> {plane.pilotScore}
        </p>
      )}

      {/* ✅ Ocultar vida y combustible si es un oponente */}
      {!isOpponent && (
        <>
          <div className="stat-label">❤️ Salud</div>
          <div className="stat-container">
            <div
              className="stat-bar health-bar"
              style={{ width: `${(currentPlane.health / currentPlane.baseHealth) * 100}%` }}
            ></div>
          </div>

          <div className="stat-label">🔥 Combustible</div>
          <div className="stat-container">
            <div
              className="stat-bar fuel-bar"
              style={{ width: `${(currentPlane.fuel / 100) * 100}%` }}
            ></div>
          </div>
        </>
      )}

      {/* ✅ Mostrar botones diferentes si es un oponente */}
      <div className="plane-actions">
        {isOpponent ? (
          <>
            <button className="accept-battle" onClick={handleAcceptBattle}>
              ✔️ Aceptar
            </button>
            <button className="retreat-button" onClick={handleRetreat}>
              ✖️ Retirarse
            </button>
          </>
        ) : (
          <>
            <button className="repair" onClick={() => handlePlaneAction(plane.id, "REPAIR")} disabled={updatingPlane}>
              {updatingPlane ? "🔄..." : "🔧 Reparar"}
            </button>
            <button className="refuel" onClick={() => handlePlaneAction(plane.id, "REFUEL")} disabled={updatingPlane}>
              {updatingPlane ? "🔄..." : "⛽ Repostar"}
            </button>
            <button className="battle" onClick={handleBattle} disabled={updatingPlane}>
              {updatingPlane ? "🔄..." : "⚔️ Batalla"}
            </button>
          </>
        )}
      </div>


      {/* ✅ Selector de accesorios (solo si NO es un oponente) */}
      {!isOpponent && (
        <div className="accessory-purchase">
          <select
            value={selectedAccessory || "default"}
            onChange={(e) => setSelectedAccessory(e.target.value)}
            disabled={loadingAccessories}
          >
            <option value="default" disabled hidden>
              🛠️ Equipar accesorio 🛠️
            </option>
            {accessories.map((acc) => (
              <option key={acc.name} value={acc.name}>
                {acc.name} - 💰 {acc.price}
              </option>
            ))}
          </select>

          <button onClick={handleBuyAccessory} disabled={buyingAccessory || !selectedAccessory}>
            {buyingAccessory ? "🔄 Comprando..." : "💸 Comprar 💸"}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaneCard;
