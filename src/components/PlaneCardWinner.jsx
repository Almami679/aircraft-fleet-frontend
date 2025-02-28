import React from "react";
import { getPlaneImage } from "../constants/planeMap";
import "./PlaneCardWinner.css"; // ✅ Estilos personalizados

const PlaneCardWinner = ({ plane, isWinner }) => {
    const healthPercentage = plane.health > 0 ? (plane.health / plane.baseHealth) * 100 : 0;
    const fuelPercentage = plane.fuel > 0 ? plane.fuel : 0;
  return (
    <div className={`plane-card-winner ${isWinner ? "winner" : "loser"}`}>
      {/* ✅ Mensaje de resultado */}
      <h2 className="winner-message">
        {isWinner ? "🏆 ¡VICTORIA!" : "💥 AVIÓN DESTRUIDO..."}
      </h2>

      {/* ✅ Imagen del avión */}
      <img src={getPlaneImage(plane)} alt={plane.name} className="plane-image" />

      {/* ✅ Info del avión */}
      <h3 className="plane-name">{plane.name}</h3>
      <p className="pilot-info">
        ✈️ <b>Piloto:</b> {plane.pilotName} / 🏆 <b>Score:</b> {plane.pilotScore}
      </p>

      {/* ✅ Salud y Combustible final con valores reales */}
            <div className="stat-label">❤️ Salud Final</div>
            <div className="stat-container">
              <div
                className="stat-bar health-bar"
                style={{ width: `${healthPercentage}%` }}
              ></div>
            </div>

            <div className="stat-label">🔥 Combustible Restante</div>
            <div className="stat-container">
              <div
                className="stat-bar fuel-bar"
                style={{ width: `${fuelPercentage}%` }}
              ></div>
            </div>
          </div>
        );
      };

export default PlaneCardWinner;
