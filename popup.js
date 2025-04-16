document.addEventListener("DOMContentLoaded", () => {
    const boton = document.getElementById("censurar");
    if (boton) {
      boton.addEventListener("click", () => {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "censurar" }, function(response) {
              if (chrome.runtime.lastError) {
                console.error("No se pudo establecer conexión con content.js:", chrome.runtime.lastError.message);
              } else {
                console.log("Mensaje recibido por content.js:", response);
              }
            });
          });
          
      });
    }
  });
  