document.addEventListener("DOMContentLoaded", () => {
    const API_URL = "http://192.168.1.241:3000";
    const container = document.getElementById("container");
    const qrSelect = document.getElementById("qr-select");
    const qrDisplay = document.getElementById("qr-display");
    const veloNomInput = document.getElementById("velo-nom");

    let qrData = JSON.parse(localStorage.getItem("qrData")) || {};
    let qrIdCounter = Object.keys(qrData).length ? Math.max(...Object.keys(qrData).map(Number)) + 1 : 1;

    // ✅ Fonction pour récupérer et afficher les vélos
    function fetchVelos() {
        fetch(`${API_URL}/velos`)
            .then(response => response.json())
            .then(data => {
                if (!Array.isArray(data)) throw new Error("Données des vélos invalides");
                if (!container) throw new Error("Élément 'container' non trouvé");

                container.innerHTML = ""; // Nettoyage avant ajout
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
    }

    fetchVelos(); // Chargement des vélos au démarrage

    // ✅ Fonction pour générer un QR Code
    function generateQRCode(id, data) {
        const div = document.createElement("div");
        div.id = `qr-${id}`;
        div.classList.add("qr-item");
        new QRCode(div, { text: data, width: 128, height: 128 });
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

    // ✅ Met à jour la liste des QR Codes
    function updateSelectOptions() {
        qrSelect.innerHTML = "";
        Object.keys(qrData).forEach(id => {
            const option = document.createElement("option");
            option.value = id;
            option.text = `QR Code ${id}`;
            qrSelect.add(option);
        });
    }

    // ✅ Combinaison de l'ajout, suppression, et envoi des QR Codes en une seule ligne
    document.getElementById("manage-qr").addEventListener("click", () => {
        const action = document.getElementById("action-select").value;  // Récupère l'action choisie
        if (action === "add") {
            const newId = qrIdCounter++;
            qrData[newId] = `${API_URL}/velo/${newId}`;
            localStorage.setItem("qrData", JSON.stringify(qrData));
            updateSelectOptions();
            updateQRCodeDisplay();
            alert("✅ QR Code ajouté.");
        } else if (action === "remove") {
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
            alert("✅ QR Code(s) supprimé(s).");
        } else if (action === "submit") {
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
        }
    });

    // ✅ Ajout d'un vélo avec QR Code
    document.getElementById("add-velo").addEventListener("click", () => {
        const nomVelo = veloNomInput.value.trim();
        if (!nomVelo) {
            alert("Veuillez entrer un nom de vélo.");
            return;
        }

        fetch(`${API_URL}/save_velo`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nom: nomVelo })
        })
        .then(response => response.json())
        .then(data => {
            alert(data.success || data.error);
            if (data.success) {
                fetchVelos(); // Recharger la liste des vélos après ajout
            }
        })
        .catch(error => {
            console.error("❌ Erreur :", error);
            alert("❌ Une erreur est survenue lors de l'ajout du vélo.");
        });

        veloNomInput.value = ""; // Réinitialiser l'input après l'ajout
    });

    // ✅ Restauration des QR codes au chargement
    updateSelectOptions();
});