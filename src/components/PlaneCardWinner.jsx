import React from "react";
import { getPlaneImage } from "../constants/planeMap";
import "./PlaneCardWinner.css"; // ✅ Estilos personalizados

const PlaneCardWinner = ({ plane, isWinner, userWon }) => {
    const healthPercentage = plane.health > 0 ? (plane.health / plane.baseHealth) * 100 : 0;
    const fuelPercentage = plane.fuel > 0 ? plane.fuel : 0;

    console.log("lo que llega de userWon" + userWon);

  return (
    <div className={`plane-card-winner ${isWinner ? "winner" : "loser"}`}>
      {/* ✅ Mensaje de resultado */}
      <h2 className="winner-message">
        🏆 VICTORIA DE:
      </h2>

      {/* ✅ Imagen del avión */}
      <img src={getPlaneImage(plane)} alt={plane.name} className="plane-image" />

      {/* ✅ Info del avión */}
      <h3 className="plane-name">{plane.name}</h3>
      <p className="pilot-info">
        ✈️ <b>Piloto:</b> {userWon.username}
      </p>

          </div>
        );
      };

export default PlaneCardWinner;
