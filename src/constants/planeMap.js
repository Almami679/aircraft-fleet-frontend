// src/constants/planeMap.js

// Mapeo de imágenes de aviones base
const planeImages = {
  "Spitfire": "/images/imagenesfront/avionesapi/Spitfire.PNG",
  "Messerschmitt Bf 109": "/images/imagenesfront/avionesapi/Messerschmitt.PNG",
  "P-51 Mustang": "/images/imagenesfront/avionesapi/P51-Mustang.PNG",
  "Mitsubishi A6M Zero": "/images/imagenesfront/avionesapi/A6-Zero.PNG",
  "Focke-Wulf Fw 190": "/images/imagenesfront/avionesapi/Focke-Wulf.PNG",
  "Yakovlev Yak-3": "/images/imagenesfront/avionesapi/YAK_3.PNG"
};

// Mapeo de imágenes de accesorios **con nombres exactamente como en el backend**
const accessoryImages = {
  "MG 42": "-MG42.PNG",
  "Cañon 20mm Hispano": "-cannon.PNG",
  "Misil V2 Aleman": "-misile.PNG",
  "Blindaje Ligero": "-blindado.PNG",
  "Blindaje Medio": "-blindado.PNG",
  "Blindaje Pesado": "-blindado.PNG"
};

// ✅ Función para obtener la imagen correcta del avión con su accesorio equipado
export function getPlaneImage(plane) {
  let baseImage = planeImages[plane.name] || "/images/default-plane.png";

  if (plane.equippedAccessory && plane.equippedAccessory.name) {
    // 🔹 Normalizamos el nombre para evitar problemas de acentos y espacios extra
    let normalizedAccessory = plane.equippedAccessory.name
      .trim()
      .replace(/\s+/g, " ") // 🔹 Eliminar espacios extra entre palabras
      .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // 🔹 Eliminar tildes (ej. "Alemán" -> "Aleman")

    // 🔹 Buscamos en el mapeo de accesorios con la versión normalizada
    const accessorySuffix = accessoryImages[normalizedAccessory];

    if (accessorySuffix) {
      console.log(`✅ Accesorio detectado: ${normalizedAccessory} -> Asignando imagen: ${accessorySuffix}`);
      baseImage = baseImage.replace(".PNG", accessorySuffix);
    } else {
      console.warn(`⚠️ No se encontró imagen para accesorio: ${normalizedAccessory}`);
    }
  }

  return baseImage;
}

