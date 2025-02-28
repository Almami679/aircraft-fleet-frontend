import React from "react";
import axios from "axios";
import { getPlaneImage } from "../constants/planeMap";
import "./PlaneSell.css";

const PlaneSell = ({ plane, fetchUserData }) => {

  // ✅ Función para comprar el avión
  const handleBuyPlane = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("⚠️ Debes iniciar sesión para comprar aviones.");
        return;
      }

      await axios.post(
        `/aircraft/store/buy/plane`,
        null,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { planeId: plane.id }
        }
      );

      alert("✅ Avión comprado con éxito.");
      fetchUserData(); // 🔹 Actualizar los datos tras la compra
    } catch (error) {
      console.error("❌ Error al comprar avión:", error);
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
