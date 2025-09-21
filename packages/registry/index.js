const express = require('express);
const mysql = require('mysql2');
const app = express();
const PORT = 3000;

// --- Configuration de la connexion à la base de données ---
// ATTENTION : Ne jamais mettre d'informations sensibles directement dans le code pour un vrai projet.
// Pour cet exercice, c'est acceptable.
const dbConnectionString = 'mysql://avnadmin:AVNS_BvVULOCxM7CcMQd0Aqw@mysql-1a36101-botwii.c.aivencloud.com:14721/defaultdb?ssl-mode=false';

const connection = mysql.createConnection(dbConnectionString);

connection.connect((err) => {
  if (err) {
    console.error('❌ Erreur de connexion à la base de données de Dragon :', err.stack);
    return;
  }
  console.log('✅ Connecté à la base de données de Dragon avec l\'ID de thread', connection.threadId);
});

// --- Routes de l'API ---
app.get('/', (req, res) => {
  res.send('L\'Antre du Dragon est éveillé et connecté à sa source de pouvoir ! 🐉');
});

app.listen(PORT, () => {
  console.log(`Le Registre de Dragon écoute sur le port ${PORT}`);
});
