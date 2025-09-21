const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// --- Configuration du stockage avec Multer ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Le dossier où seront stockés les paquets
    const storagePath = path.join(__dirname, 'dragon-storage');
    // S'assurer que le dossier existe
    fs.mkdirSync(storagePath, { recursive: true });
    cb(null, storagePath);
  },
  filename: (req, file, cb) => {
    // On garde le nom de fichier original (ex: mon-paquet-1.0.0.tgz)
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// --- Routes de l'API ---

app.get('/', (req, res) => {
  res.send('L\'Antre du Dragon est éveillé ! 🐉');
});

// La nouvelle route pour publier un paquet
// 'package' est le nom du champ que le CLI devra utiliser pour envoyer le fichier
app.post('/publish', upload.single('package'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('Aucun paquet reçu.');
  }

  console.log(`🐉 Paquet reçu et stocké : ${req.file.originalname}`);
  res.status(200).send(`Paquet ${req.file.originalname} publié avec succès !`);
});

app.listen(PORT, () => {
  console.log(`Le Registre de Dragon écoute sur le port ${PORT}`);
});
