fetch("http://192.168.1.141:3000/save_qr", {  // Remplace par l'URL de ton backend
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ qrCodes: Array.from(selectedQRCodes) })
})