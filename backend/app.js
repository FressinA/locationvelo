// filepath: /var/www/html/locationvelo/backend/app.js
const express = require('express');
const app = express();
const port = 3000;

// Importer les routes
const velosRouter = require('./routes/velos');

// Utiliser les routes
app.use('/velos', velosRouter);

app.listen(port, () => {
    console.log(`Server running at http://192.168.1.241:${PORT}/`);
});