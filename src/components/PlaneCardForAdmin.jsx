import React, { useState, useEffect } from "react";
import axios from "axios";
import { getPlaneImage } from "../constants/planeMap";
import { accessoryMap } from "../constants/accessoryMap";
import "./PlaneCard.css";

const PlaneCardForAdmin = ({ user, fetchUserData }) => {
  const [accessories, setAccessories] = useState([]);
  const [selectedAccessory, setSelectedAccessory] = useState("");
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [buyingAccessory, setBuyingAccessory] = useState(false);
  const [updatingPlane, setUpdatingPlane] = useState(false);
   const [message, setMessage] = useState("");

  // 🔹 Obtenemos la info del avión y usuario desde el prop `user`
  const { username, plane } = user || {};
  const [currentPlane, setCurrentPlane] = useState(plane);

  useEffect(() => {
    setCurrentPlane(plane);
  }, [plane]);

  // 🔹 Obtener accesorios disponibles
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


    });

    // ✅ Solo corregimos la parte que causaba errores de compilación


    // ✅ Función para ejecutar acciones (reparar, repostar, vender)
      const handlePlaneAction = async (planeId, action) => {
          console.log("📌 Ejecutando acción:", action);
          console.log("🛩️ Datos del avión antes de la acción:", planeId, currentPlane);

          if (!planeId) {
              console.error("❌ Error: planeId es undefined, no se puede continuar.");
              setMessage("⚠️ No se pudo realizar la acción, ID de avión inválido.");
              return;
          }

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

              setMessage(`✅ Acción ${action} completada.`);
              fetchUserData(); // 🔄 Recargar datos
          } catch (error) {
              console.error(`❌ Error en acción ${action}:`, error);
              setMessage(`⚠️ No se pudo realizar la acción: ${action}`);

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



  return (
    <div className="plane-card admin-plane-card">


      {/* ✅ Imagen del avión */}
      <img
        src={getPlaneImage(currentPlane)}
        alt={plane.name}
        className="plane-image"
      />
      <h3 className="plane-name">{plane.name}</h3>

      {/* ✅ Botón de vender avión (ahora encima de la imagen) */}
            <button
              className="sell-button"
              onClick={() => handlePlaneAction(plane.planeId, "SELL")}
              disabled={updatingPlane}
            >
              ❌ Eliminar avion ❌
            </button>

      {/* ✅ Mostrar el nombre del propietario */}
      <h4 className="plane-owner">👤 Propietario: {username || "Desconocido"}</h4>

      {/* ✅ Vida del avión */}
      <div className="stat-label">❤️ Salud</div>
      <div className="stat-container">
        <div
          className="stat-bar health-bar"
          style={{ width: `${(currentPlane.health / 130) * 100}%` }}
        ></div>
      </div>

      {/* ✅ Combustible */}
      <div className="stat-label">🔥 Combustible</div>
      <div className="stat-container">
        <div
          className="stat-bar fuel-bar"
          style={{ width: `${(currentPlane.fuel / 100) * 100}%` }}
        ></div>
      </div>

      {/* ✅ Selector de accesorios (para admins) */}
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
              {acc.name}
            </option>
          ))}
        </select>

        <button onClick={handleBuyAccessory} disabled={buyingAccessory || !selectedAccessory}>
          {buyingAccessory ? "🔄 Aplicando..." : "🛠️ Equipar"}
        </button>
      </div>

      {/* ✅ Botones de acciones */}
      <div className="plane-actions">
        <>
                    <button className="repair" onClick={() => handlePlaneAction(currentPlane?.planeId, "REPAIR")} disabled={updatingPlane}>
                      {updatingPlane ? "🔄..." : "🔧 Reparar"}
                    </button>
                    <button className="refuel" onClick={() => handlePlaneAction(currentPlane?.planeId, "REFUEL")} disabled={updatingPlane}>
                      {updatingPlane ? "🔄..." : "⛽ Repostar"}
                    </button>

                  </>
      </div>
    </div>
  );
};

export default PlaneCardForAdmin;
