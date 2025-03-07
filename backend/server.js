const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root",  // Mets ton utilisateur MySQL
    password: "alexandre",   // Mets ton mot de passe MySQL
    database: "ta_base"
});

db.connect(err => {
    if (err) {
        console.error("Erreur de connexion à MySQL:", err);
        return;
    }
    console.log("Connecté à la base de données MySQL");
});

// Route pour enregistrer les QR codes en BDD
app.post("/save_qr", (req, res) => {
    const { qrCodes } = req.body;
    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
        return res.status(400).json({ error: "Données invalides" });
    }

    const query = "INSERT INTO qr_codes (qr_id) VALUES ?";
    const values = qrCodes.map(id => [id]);

    db.query(query, [values], (err, result) => {
        if (err) {
            console.error("Erreur lors de l'insertion:", err);
            return res.status(500).json({ error: "Erreur serveur" });
        }
        res.json({ success: "QR Codes enregistrés !" });
    });
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Serveur backend lancé sur http://192.168.1.241:${PORT}`);
});