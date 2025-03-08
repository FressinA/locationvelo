const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Configuration de la base de données
const dbConfig = {
    host: "localhost",
    user: "alexandre",
    password: "alexandre",
    database: "qr_code_db"
};

// Fonction pour établir la connexion MySQL
let db;
async function connectDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log("✅ Connecté à la base de données MySQL");
    } catch (err) {
        console.error("❌ Erreur de connexion à MySQL:", err);
        setTimeout(connectDB, 5000); // Tente une reconnexion après 5 secondes
    }
}
connectDB();

// ✅ Route pour enregistrer les QR codes en BDD
app.post("/save_qr", async (req, res) => {
    const { qrCodes } = req.body;

    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
        return res.status(400).json({ error: "❌ Données invalides" });
    }

    const query = "INSERT INTO qr_codes (qr_id) VALUES ?";
    const values = qrCodes.map(id => [id]);

    try {
        const [result] = await db.query(query, [values]);
        console.log("✅ QR Codes enregistrés :", result);
        res.json({ success: "✅ QR Codes enregistrés !" });
    } catch (err) {
        console.error("❌ Erreur lors de l'insertion :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Route pour récupérer les vélos
app.get("/velos", async (req, res) => {
    try {
        const [results] = await db.query("SELECT * FROM velos");
        console.log("✅ Données des vélos envoyées :", results.length);
        res.json(results);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des vélos :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Page d'accueil pour tester si le serveur fonctionne
app.get("/", (req, res) => {
    res.send("✅ Serveur Node.js fonctionne !");
});

// ✅ Démarrage du serveur sur l'adresse IP locale
const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Serveur backend lancé sur http://192.168.1.241:${PORT}`);
});