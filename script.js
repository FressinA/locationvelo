document.addEventListener("DOMContentLoaded", () => {
    const qrCodes = document.querySelectorAll(".qr-code");
    const selectedQRCodes = new Set();

    qrCodes.forEach(qr => {
        qr.addEventListener("click", () => {
            const id = qr.dataset.id;
            if (selectedQRCodes.has(id)) {
                selectedQRCodes.delete(id);
                qr.classList.remove("selected");
            } else {
                selectedQRCodes.add(id);
                qr.classList.add("selected");
            }
        });
    });

    document.getElementById("submit").addEventListener("click", () => {
        if (selectedQRCodes.size === 0) {
            alert("Sélectionnez au moins un QR Code.");
            return;
        }

        fetch("save_qr.php", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCodes: Array.from(selectedQRCodes) })
        })
        .then(response => response.text())
        .then(data => alert(data))
        .catch(error => console.error("Erreur :", error));
    });
});