chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "censurar") {
      censurarTodasLasImagenes();
    }
  });
  
function censurarImagen(img) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
  
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
  
    ctx.drawImage(img, 0, 0);
  
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("image", blob, "image.png");
  
      try {
        const response = await fetch("http://127.0.0.1:5000/censurar", {
          method: "POST",
          body: formData,
        });
  
        const censuradaBlob = await response.blob();
        const censuradaUrl = URL.createObjectURL(censuradaBlob);
        img.src = censuradaUrl;
      } catch (error) {
        console.error("Error censurando imagen:", error);
      }
    }, "image/png");
}
  
function censurarTodasLasImagenes() {
    const imagenes = document.querySelectorAll("img");
    imagenes.forEach(img => {
      if (img.complete) {
        censurarImagen(img);
      } else {
        img.onload = () => censurarImagen(img);
      }
    });
}
  