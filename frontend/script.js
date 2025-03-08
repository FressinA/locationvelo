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

    const qrImages = {
        1: 'https://example.com/qr1.png', // Replace with actual image URL
        2: 'https://example.com/qr2.png', // Replace with actual image URL
        3: 'https://example.com/qr3.png'  // Replace with actual image URL
    };

    document.getElementById('qr-select').addEventListener('change', function() {
        const selectedValue = this.value;
        document.getElementById('qr-image').src = qrImages[selectedValue] || 'default.png';
    });

    document.getElementById('add-qr').addEventListener('click', function() {
        const qrSelect = document.getElementById('qr-select');
        const newOption = document.createElement('option');
        const newValue = qrSelect.options.length + 1;
        newOption.value = newValue;
        newOption.text = 'QR Code ' + newValue;
        qrSelect.add(newOption);
        qrImages[newValue] = generateQRCode('QR Code ' + newValue); // Generate new QR code
    });

    document.getElementById('remove-qr').addEventListener('click', function() {
        const qrSelect = document.getElementById('qr-select');
        if (qrSelect.selectedIndex !== -1) {
            delete qrImages[qrSelect.value]; // Remove image URL
            qrSelect.remove(qrSelect.selectedIndex);
            document.getElementById('qr-image').src = 'default.png'; // Reset image
        } else {
            alert('Veuillez sélectionner un QR Code à supprimer.');
        }
    });

    document.getElementById('save').addEventListener('click', function() {
        alert('Enregistrer les QR Codes sélectionnés.');
        // Ajoutez ici la logique pour enregistrer les QR Codes
    });

    document.getElementById('print').addEventListener('click', function() {
        window.print();
    });

    function generateQRCode(text) {
        const qr = new QRCode(document.createElement('div'), {
            text: text,
            width: 128,
            height: 128
        });
        return qr._el.childNodes[0].toDataURL();
    }
});