// src/constants/planeMap.js

// Mapeo de imágenes de aviones
const planeImages = {
  "Spitfire": "/images/imagenesfront/avionesapi/Spitfire.PNG",
  "Messerschmitt Bf 109": "/images/imagenesfront/avionesapi/Messerschmitt.PNG",
  "P-51 Mustang": "/images/imagenesfront/avionesapi/P51-Mustang.PNG",
  "Mitsubishi A6M Zero": "/images/imagenesfront/avionesapi/A6-Zero.PNG",
  "Focke-Wulf Fw 190": "/images/imagenesfront/avionesapi/Focke-Wulf.PNG",
  "Yakovlev Yak-3": "/images/imagenesfront/avionesapi/YAK_3.PNG"
};

// Mapeo de imágenes según accesorio equipado
const accessoryImages = {
  "MG 42": "-MG42.PNG",
  "Cañón 20mm Hispano": "-cannon.PNG",
  "Cohete V2 Alemán": "-misile.PNG",
  "Blindaje Ligero": "-blindado.PNG",
  "Blindaje Medio": "-blindado.PNG",
  "Blindaje Pesado": "-blindado.PNG"
};

// Función para obtener la imagen correcta del avión según su accesorio equipado
export function getPlaneImage(plane) { // <-- Asegurar la exportación
  let baseImage = planeImages[plane.name]; // Imagen por defecto si no se encuentra
  if (!baseImage) {
    console.warn(`No se encontró imagen para el avión: ${plane.name}`);
    return "/images/default-plane.png"; // Imagen por defecto si el avión no está en el listado
  }

  if (plane.equippedAccessory) {
    const accessorySuffix = accessoryImages[plane.equippedAccessory.name];
    if (accessorySuffix) {
      baseImage = baseImage.replace(".PNG", accessorySuffix);
    }
  }
  return baseImage;
}

