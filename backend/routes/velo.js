// filepath: /var/www/html/locationvelo/backend/routes/velos.js
const express = require('express');
const router = express.Router();

// Exemple de données
const velos = [
    { nom: 'Velo 1', qr_code: 'https://example.com/qrcode1.png' },
    { nom: 'Velo 2', qr_code: 'https://example.com/qrcode2.png' }
];

// Route pour obtenir les vélos
router.get('/', (req, res) => {
    res.json({ velos });
});

module.exports = router;