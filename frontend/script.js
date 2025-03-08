document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://192.168.1.241:3000";
    const container = document.getElementById("container");
    const qrSelect = document.getElementById("qr-select");
    const qrDisplay = document.getElementById("qr-display");
    let qrData = JSON.parse(localStorage.getItem("qrData")) || {};
    let qrIdCounter = Object.keys(qrData).length ? Math.max(...Object.keys(qrData).map(Number)) + 1 : 1;

    // ✅ Récupération et affichage des vélos depuis l'API
    fetch(`${API_URL}/velos`)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) {
                throw new Error("Données des vélos invalides");
            }
            if (!container) {
                throw new Error("Élément 'container' non trouvé");
            }
            container.innerHTML = ""; // Nettoyer avant d'ajouter les vélos
            data.forEach(velo => {
                const div = document.createElement("div");
                div.classList.add("velo");
                div.innerHTML = `
                    <h3>${velo.nom}</h3>
                    <img src="${velo.qr_code}" alt="QR Code ${velo.nom}" width="150">
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("❌ Erreur lors du chargement des vélos :", error));

    // ✅ Fonction pour générer un QR Code
    function generateQRCode(id, data) {
        const div = document.createElement("div");
        div.id = `qr-${id}`;
        div.classList.add("qr-item");
        new QRCode(div, {
            text: data,
            width: 128,
            height: 128
        });
        return div;
    }

    // ✅ Met à jour l'affichage des QR Codes sélectionnés
    function updateQRCodeDisplay() {
        qrDisplay.innerHTML = "";
        const selectedValues = Array.from(qrSelect.selectedOptions).map(opt => opt.value);
        selectedValues.forEach(id => {
            if (qrData[id]) {
                qrDisplay.appendChild(generateQRCode(id, qrData[id]));
            }
        });
    }

    // ✅ Met à jour la liste déroulante des QR Codes
    function updateSelectOptions() {
        qrSelect.innerHTML = "";
        Object.keys(qrData).forEach(id => {
            const option = document.createElement("option");
            option.value = id;
            option.text = `QR Code ${id}`;
            qrSelect.add(option);
        });
    }

    // ✅ Ajouter un QR Code
    document.getElementById("add-qr").addEventListener("click", function () {
        const newId = qrIdCounter++;
        qrData[newId] = `${API_URL}/velo/${newId}`;
        localStorage.setItem("qrData", JSON.stringify(qrData));
        updateSelectOptions();
        updateQRCodeDisplay();
    });

    // ✅ Supprimer un QR Code sélectionné
    document.getElementById("remove-qr").addEventListener("click", function () {
        const selectedOptions = Array.from(qrSelect.selectedOptions);
        if (selectedOptions.length === 0) {
            alert("Sélectionnez un QR Code à supprimer.");
            return;
        }
        selectedOptions.forEach(option => {
            delete qrData[option.value];
            option.remove();
        });
        localStorage.setItem("qrData", JSON.stringify(qrData));
        updateQRCodeDisplay();
    });

    qrSelect.addEventListener("change", updateQRCodeDisplay);

    // ✅ Sauvegarde locale des QR Codes
    document.getElementById("save").addEventListener("click", function () {
        localStorage.setItem("qrData", JSON.stringify(qrData));
        alert("✅ QR Codes enregistrés localement.");
    });

    // ✅ Envoi des QR Codes en base de données
    document.getElementById("submit").addEventListener("click", function () {
        const qrArray = Object.keys(qrData);
        if (qrArray.length === 0) {
            alert("Aucun QR Code à envoyer.");
            return;
        }
        fetch(`${API_URL}/save_qr`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qrCodes: qrArray })
        })
            .then(response => response.json())
            .then(data => alert(data.success || data.error))
            .catch(error => {
                console.error("❌ Erreur :", error);
                alert("❌ Une erreur est survenue lors de l'envoi des QR Codes.");
            });
    });

    // ✅ Impression des QR Codes
    document.getElementById("print").addEventListener("click", function () {
        window.print();
    });

    // ✅ Restauration des QR codes au chargement
    updateSelectOptions();
});