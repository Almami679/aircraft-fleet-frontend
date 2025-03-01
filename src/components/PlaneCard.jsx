import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ Hook de navegación
import { getPlaneImage } from "../constants/planeMap";
import { accessoryMap } from "../constants/accessoryMap"; // ✅ Importamos el map de accesorios
import "./PlaneCard.css";


const PlaneCard = ({ plane, fetchUserData, isOpponent = false, selectedPlayerPlane, opponentData }) => {
  const navigate = useNavigate();

  const [accessories, setAccessories] = useState([]);
  const [selectedAccessory, setSelectedAccessory] = useState("");
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [buyingAccessory, setBuyingAccessory] = useState(false);
  const [updatingPlane, setUpdatingPlane] = useState(false);
  const [currentPlane, setCurrentPlane] = useState(plane);
  const [message, setMessage] = useState("");


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

  // ✅ Solo corregimos la parte que causaba errores de compilación


  // ✅ Función para ejecutar acciones (reparar, repostar, vender)
  const handlePlaneAction = async (planeId, action) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.put(
        `/aircraft/hangar/update-plane/${planeId}`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { action },
        }
      );

      if (action === "SELL") {
        setMessage("✅ Avión vendido.");

        // ⏳ Esperar 2 segundos antes de actualizar los datos
        setTimeout(() => {
          setMessage(""); // 🔹 Limpiar el mensaje
          fetchUserData(); // 🔄 Recargar los datos después del tiempo de espera
        }, 2000);
      } else {
        fetchUserData(); // 🔄 Si no es venta, actualizar inmediatamente
      }
    } catch (error) {
      console.error(`❌ Error en acción ${action}:`, error);
      setMessage(`⚠️ No se pudo realizar la acción: ${action}`);

      // 🔹 También limpiar el mensaje después de 2s en caso de error
      setTimeout(() => setMessage(""), 2000);
    }
  };



  // ✅ Función para comprar y equipar un accesorio
  const handleBuyAccessory = async () => {
    if (!selectedAccessory) {
      setMessage("⚠️ Selecciona un accesorio antes de comprarlo.");
      return;
    }

    // 🔹 Extraer solo el nombre del accesorio sin el precio
    const accessoryName = selectedAccessory.split(" - ")[0];

    // 🔹 Convertir el nombre en `enumName` usando `accessoryMap`
    const enumName = accessoryMap[accessoryName];

    if (!enumName) {
      setMessage("⚠️ Error: No se encontró el accesorio en el sistema.");
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

      setMessage("✅ Accesorio equipado.");
      fetchUserData(); // 🔹 Actualizar datos tras la compra
    } catch (error) {
      console.error("❌ Error al comprar accesorio:", error);
      setMessage("❌ Verifica tu saldo.");
    } finally {
      setBuyingAccessory(false);

      setTimeout(() => setMessage(""), 2000);
    }
  };

  // ✅ Función para iniciar una batalla
  const handleBattle = () => {
      if (!plane || !plane.id) {
          console.error("❌ Error: No se encontró el avión para la batalla.");
          setMessage("No se pudo iniciar la batalla. Verifica que tienes un avión seleccionado.");
          return;
      }

      console.log("🚀 Guardando avión seleccionado para batalla:", plane);

      // ✅ Guardar el avión seleccionado en localStorage
      localStorage.setItem("selectedPlayerPlane", JSON.stringify(plane));

      // ✅ Navegar a la página de batalla
      navigate("/battle");
  };



 // ✅ Función para aceptar la batalla y redirigir a BattleSimulator
 const handleAcceptBattle = () => {
     console.log("📌 Debug: Datos recibidos en PlaneCard.jsx");
     console.log("🛩️ Avión seleccionado:", selectedPlayerPlane);
     console.log("🎯 Oponente:", opponentData);

     if (!selectedPlayerPlane || !opponentData) {
       console.error("❌ Error: No hay avión seleccionado o no hay oponente.");
       alert("Debe seleccionarse un avión y un oponente antes de iniciar la batalla.");
       return;
     }

     console.log("🚀 Iniciando batalla con:", selectedPlayerPlane, "vs", opponentData);

     // 🔹 Guardar datos en `localStorage` para BattleSimulationPage
     localStorage.setItem("selectedPlayerPlane", JSON.stringify(selectedPlayerPlane));
     localStorage.setItem("opponentData", JSON.stringify(opponentData));

     // 🔹 Redirigir a `BattleSimulationPage`
     navigate('/battle-simulation');
 };


  // ✅ Función para retirarse (solo en oponentes)
  const handleRetreat = () => {
    console.log("❌ Retirándose de la batalla...");
    navigate("/aircraft/hangar/user");
  };

  return (
    <div className="plane-card">
        {/* ✅ Mensaje flotante */}
              {message && <div className="message-box">{message}</div>}


      {/* ✅ Imagen del avión */}
      <img src={getPlaneImage(currentPlane)} alt={plane.name} className="plane-image" />
      <h3 className="plane-name">{plane.name}</h3>

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
              ✔️ Aceptar batalla
            </button>
            <button className="retreat-button" onClick={handleRetreat}>
              ❌ Retirarse
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
              🛠️ Equipar accesorio
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
