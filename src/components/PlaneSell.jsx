import React from "react";
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
  // ✅ Función para comprar el avión
  const handleBuyPlane = async () => {
    if (!plane || !plane.name) {
      alert("Error: No se encontró la información del avión.");
      return;
    }

    console.log("📌 DEBUG - Nombre del avión recibido:", plane.name);

    const planeEnum = planeEnumMap[plane.name];

    if (!planeEnum) {
      alert(`Error: No se encontró el código enum para el avión "${plane.name}".`);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      await axios.post(
        `/aircraft/store/buy/plane`, // 🔹 Ruta corregida
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { model: planeEnum }, // ✅ Enviar el `model` como enum
        }
      );

      alert(`✅ Avión "${plane.name}" comprado con éxito.`);

      // 🔹 Recargar datos del usuario después de la compra
      fetchUserData();

    } catch (error) {
      console.error("❌ Error al comprar el avión:", error);
      alert("No se pudo comprar el avión. Verifica tu saldo.");
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
    </div>
  );
};

export default PlaneSell;
