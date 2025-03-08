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
});