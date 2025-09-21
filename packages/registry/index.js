const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.send('L\'Antre du Dragon est éveillé ! 🐉');
});

app.listen(PORT, () => {
  console.log(`Le Registre de Dragon écoute sur le port ${PORT}`);
});
