import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getPlaneImage } from '../constants/planeMap';
import { accessoryMap } from "../constants/accessoryMap";
import './PlaneCard.css';

const PlaneCard = ({ plane, handleRepair, handleRefuel, handleBattle, fetchUserData }) => {
  // Estado para almacenar los accesorios disponibles
  const [accessories, setAccessories] = useState([]);
  const [selectedAccessory, setSelectedAccessory] = useState('');
  const [loadingAccessories, setLoadingAccessories] = useState(false);
  const [buyingAccessory, setBuyingAccessory] = useState(false);

  // ✅ Obtener la lista de accesorios disponibles al montar el componente
  useEffect(() => {
    const fetchAccessories = async () => {
      setLoadingAccessories(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.warn('⚠️ No hay token, no se pueden obtener accesorios.');
          return;
        }

        const response = await axios.get('/aircraft/store/accessories', {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.status === 200) {
          console.log("✅ Accesorios recibidos:", response.data);
          setAccessories(response.data);
        } else {
          console.warn("⚠️ Respuesta inesperada del servidor:", response);
        }
      } catch (error) {
        console.error("❌ Error al obtener accesorios:", error);
      } finally {
        setLoadingAccessories(false);
      }
    };

    fetchAccessories();
  }, []); // Se ejecuta solo una vez al montar el componente

  // ✅ Función para comprar y equipar accesorio
  const handleBuyAndEquipAccessory = async () => {
      if (!selectedAccessory) {
        alert("Selecciona un accesorio antes de comprarlo.");
        return;
      }

      // 🔹 Convertir el nombre del accesorio en `enumName` usando `accessoryMap`
      const enumName = accessoryMap[selectedAccessory];

      if (!enumName) {
        alert("Error: No se encontró el accesorio en el sistema.");
        console.error("❌ El accesorio no tiene un enumName:", selectedAccessory);
        return;
      }

      console.log(`🛠️ Enviando compra: planeId=${plane.id}, planeAccessory=${enumName}`);

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          alert("Debe iniciar sesión para comprar un accesorio.");
          return;
        }

        setBuyingAccessory(true);

        const response = await axios.post(
          `/aircraft/store/buy/accessory`,
          null,
          {
            headers: { Authorization: `Bearer ${token}` },
            params: {
              planeId: plane.id,
              planeAccessory: enumName, // ✅ Enviamos el `enumName` correcto
            },
          }
        );

        alert("Accesorio comprado y equipado correctamente.");
        fetchUserData(); // Recargar datos del usuario para actualizar la wallet
      } catch (error) {
        console.error("❌ Error al comprar accesorio:", error);
        alert("No se pudo comprar el accesorio. Verifica tu saldo.");
      } finally {
        setBuyingAccessory(false);
      }
    };

  return (
    <div className="plane-card">
      <img src={getPlaneImage(plane)} alt={plane.name} className="plane-image" />
      <h3 className="plane-name">{plane.name}</h3>

      {/* Barra de vida con emoji ❤️ */}
      <div className="stat-label">❤️ Salud</div>
      <div className="stat-container">
        <div className="stat-bar health-bar" style={{ width: `${(plane.health / plane.maxHealth) * 100}%` }}></div>
      </div>

      {/* Barra de combustible con emoji 🔥 */}
      <div className="stat-label">🔥 Combustible</div>
      <div className="stat-container">
        <div className="stat-bar fuel-bar" style={{ width: `${(plane.fuel / plane.maxFuel) * 100}%` }}></div>
      </div>

      {/* Acciones */}
      <div className="plane-actions">
        <button onClick={() => handleRepair(plane.id)}>🔧 </button>
        <button onClick={() => handleRefuel(plane.id)}>⛽ </button>
        <button onClick={() => handleBattle(plane.id)}>⚔️ </button>
      </div>

      {/* Seleccionar y comprar accesorio */}
      <div className="accessory-container">
        <label htmlFor={`accessory-${plane.id}`}>🛠️ Comprar accesorio:</label>
       <select
         id={`accessory-${plane.id}`}
         value={selectedAccessory}
         onChange={(e) => {
           const selectedName = e.target.value.split(" - 💰")[0]; // 🔹 Eliminamos el precio
           setSelectedAccessory(selectedName);
         }}
         disabled={loadingAccessories}
       >
         <option value="">Selecciona un accesorio</option>
         {accessories.map((accessory) => (
           <option key={accessory.id} value={accessory.name}> {/* ✅ Ahora solo guarda el nombre */}
             {accessory.name} - 💰 {accessory.price}
           </option>
         ))}
       </select>



        <button onClick={handleBuyAndEquipAccessory} disabled={buyingAccessory || !selectedAccessory}>
          {buyingAccessory ? 'Comprando...' : '💰 Comprar'}
        </button>
      </div>
    </div>
  );
};

export default PlaneCard;


