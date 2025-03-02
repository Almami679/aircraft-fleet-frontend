import React, { useState } from "react";
import axios from "axios";
import { getPlaneImage } from "../constants/planeMap";
import "./PlaneSell.css";

// ✅ Mapeo de nombres de aviones a su Enum en el backend
const planeEnumMap = {
  "Spitfire": "SPITFIRE",
  "Messerschmitt Bf 109": "MESSERSCHMITT_BF109",
  "P-51 Mustang": "P51_MUSTANG",
  "Mitsubishi A6M Zero": "ZERO",
  "Focke-Wulf Fw 190": "FOCKE_WULF",
  "Yakovlev Yak-3": "YAK_3"
};

const PlaneSell = ({ plane, fetchUserData }) => {
  const [message, setMessage] = useState(""); // ✅ Hook dentro del componente

  // ✅ Función para comprar el avión
  const handleBuyPlane = async () => {
    if (!plane || !plane.name) {
      setMessage("❌ Error: No se encontró la información del avión.");
      return;
    }

    console.log("📌 DEBUG - Nombre del avión recibido:", plane.name);

    const planeEnum = planeEnumMap[plane.name];

    if (!planeEnum) {
      setMessage(`❌ Error: No se encontró el código enum para el avión "${plane.name}".`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `/aircraft/store/buy/plane`, // 🔹 Endpoint
        null, // ✅ Se envía `null` en el cuerpo porque solo usamos `params`
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { model: planeEnum }, // ✅ El `model` se envía como parámetro de consulta
        }
      );

      setMessage("✅ Avión comprado con éxito.");

      // ⏳ Esperar 1.8s antes de actualizar los datos
      setTimeout(() => {
        setMessage(""); // 🔹 Limpiar el mensaje

        // 🔹 Validar si `fetchUserData` está definido antes de llamarlo
        if (typeof fetchUserData === "function") {
          fetchUserData(); // 🔄 Recargar datos del usuario
        } else {
          console.warn("⚠️ Warning: fetchUserData no está definido.");
        }
      }, 1800);

    } catch (error) {
      console.error("❌ Error al comprar el avión:", error);
      setMessage("❌ Error al comprar el avión (Verifica tu saldo).");

      // ⏳ Esperar 1.8s antes de limpiar el mensaje
      setTimeout(() => {
        setMessage(""); // 🔹 Limpiar el mensaje
      }, 1800);
    }
  };

  return (
    <div className="plane-sell-card">
      {/* ✅ Imagen del avión */}
      <img src={getPlaneImage(plane)} alt={plane.name} className="plane-image" />
      <h3 className="plane-name">{plane.name}</h3>

      {/* ✅ Mostrar el valor del avión en "Px" */}
      <div className="stat-label">🔥 {plane.health} - Px</div>

      {/* ✅ Botón de compra con el precio */}
      <button className="buy-button" onClick={handleBuyPlane}>
        💰 Comprar - {plane.price}$
      </button>

      {/* ✅ Mensaje de compra */}
      {message && <p className="message-box">{message}</p>}
    </div>
  );
};

export default PlaneSell;
