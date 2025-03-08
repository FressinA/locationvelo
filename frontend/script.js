// filepath: /var/www/html/locationvelo/frontend/script.js
document.addEventListener("DOMContentLoaded", () => {
    fetch('http://192.168.1.241:3000/velos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const velos = data.velos; // Assurez-vous que la structure des données est correcte
            const container = document.getElementById('container'); // Assurez-vous que l'élément existe

            if (!container) {
                throw new Error('Container element not found');
            }

            velos.forEach(velo => {
                const div = document.createElement("div");
                div.classList.add("velo");
                div.innerHTML = `
                    <h3>${velo.nom}</h3>
                    <img src="${velo.qr_code}" alt="QR Code ${velo.nom}" width="150">
                `;
                container.appendChild(div);
            });
        })
        .catch(error => console.error("Erreur :", error));

    const submitButton = document.getElementById('submit');
    const qrSelect = document.getElementById('qr-select');

    submitButton.addEventListener('click', () => {
        const selectedOptions = Array.from(qrSelect.selectedOptions);
        const qrCodes = selectedOptions.map(option => option.value);

        if (qrCodes.length === 0) {
            alert('Veuillez sélectionner au moins un QR Code.');
            return;
        }

        fetch('http://192.168.1.241:3000/save_qr', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ qrCodes })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            alert(data.success);
        })
        .catch(error => {
            console.error('Erreur :', error);
            alert('Une erreur est survenue lors de l\'envoi des QR Codes.');
        });
    });
});