chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "censurar") {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (image) => {
      if (image) {
        enviarImagenAlServidor(image);
      }
    });
  }
});



function base64ToBlob(base64,mimeType){
  const byteCharacters = atob(base64.split(',')[1]);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
}


// Función para enviar la imagen al servidor Flask
async function enviarImagenAlServidor(imagenBase64) {
  try {
    // Convertir la imagen de base64 a un blob
    const blob = base64ToBlob(imagenBase64, "image/png");
    const formData = new FormData();
    formData.append("image", blob);

    // Enviar la imagen al servidor Flask
    const respuesta = await fetch("http://127.0.0.1:5000/censurar", {
      method: "POST",
      body: formData,
    });

    if (respuesta.ok) {
      const imagenProcesada = await respuesta.blob();

      // Crear una URL para la imagen procesada y abrirla en una nueva pestaña
      const url = URL.createObjectURL(imagenProcesada);
      chrome.tabs.create({ url: url }); // Abrir la imagen procesada en una nueva pestaña
    } else {
      console.error("Error en la censura:", await respuesta.text());
    }
  } catch (error) {
    console.error("Error al enviar la imagen:", error);
  }
}
