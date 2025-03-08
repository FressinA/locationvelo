const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Configuration de la base de données
const dbConfig = {
    host: "localhost",
    user: "alexandre",
    password: "alexandre",
    database: "qr_code_db"
};

// ✅ Fonction pour établir la connexion MySQL
let db;
async function connectDB() {
    try {
        db = await mysql.createConnection(dbConfig);
        console.log("✅ Connecté à la base de données MySQL");
    } catch (err) {
        console.error("❌ Erreur de connexion à MySQL:", err);
        setTimeout(connectDB, 5000); // Tentative de reconnexion après 5 secondes
    }
}
connectDB();

// ✅ Route pour enregistrer des QR codes en BDD
app.post("/save_qr", async (req, res) => {
    const { qrCodes } = req.body;

    if (!Array.isArray(qrCodes) || qrCodes.length === 0) {
        return res.status(400).json({ error: "❌ Données invalides. Veuillez envoyer une liste de QR codes." });
    }

    try {
        if (!db) await connectDB(); // Vérifie la connexion avant requête

        // Vérifier si certains QR codes existent déjà
        const [existing] = await db.query("SELECT qr_id FROM qr_codes WHERE qr_id IN (?)", [qrCodes]);
        const existingIds = new Set(existing.map(row => row.qr_id));

        // Filtrer les QR codes qui ne sont pas encore en BDD
        const newQRCodes = qrCodes.filter(id => !existingIds.has(id));

        if (newQRCodes.length === 0) {
            return res.status(409).json({ error: "❌ Tous les QR codes existent déjà en BDD." });
        }

        const query = "INSERT INTO qr_codes (qr_id) VALUES ?";
        const values = newQRCodes.map(id => [id]);

        const [result] = await db.query(query, [values]);
        console.log("✅ QR Codes enregistrés :", result);
        res.json({ success: `✅ ${result.affectedRows} QR Code(s) enregistré(s) !` });

    } catch (err) {
        console.error("❌ Erreur lors de l'insertion :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Route pour récupérer la liste des vélos
app.get("/velos", async (req, res) => {
    try {
        if (!db) await connectDB(); // Vérifie la connexion

        const [results] = await db.query("SELECT * FROM velo"); // Correction du nom de la table
        console.log("✅ Données des vélos envoyées :", results.length);
        res.json(results);
    } catch (err) {
        console.error("❌ Erreur lors de la récupération des vélos :", err);
        res.status(500).json({ error: "❌ Erreur serveur" });
    }
});

// ✅ Route pour enregistrer un vélo avec un QR code
app.post("/save_velo", async (req, res) => {
    const { nom } = req.body;

    if (!nom) {
        return res.status(400).json({ error: "❌ Nom du vélo requis" });
    }

    // Générer un QR code unique pour ce vélo
    const qrCodeURL = `http://192.168.1.241:3000/velo/${nom.replace(/\s+/g, "_")}`;

    try {
        if (!db) await connectDB(); // Vérifie la connexion

        const query = "INSERT INTO velo (nom, qr_code) VALUES (?, ?)";
        const [result] = await db.query(query, [nom, qrCodeURL]);
        console.log("✅ Vélo enregistré avec QR Code :", result);
        res.json({ success: "✅ Vélo enregistré avec QR Code !", qr_code: qrCodeURL });
    } catch (err) {
        console.error("❌ Erreur lors de l'insertion :", err);
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