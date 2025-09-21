#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const program = new Command();

// Définir l'URL de notre Registre
const REGISTRY_URL = 'http://localhost:3000';

program
  .name('drn')
  .description('Le Souffle du Dragon - Le CLI pour le gestionnaire de paquets Dragon')
  .version('0.0.1');

// Créer la commande "ping"
program
  .command('ping')
  .description('Vérifie si l\'Antre du Dragon (le Registre) est en ligne.')
  .action(async () => {
    try {
      console.log('🐉 Envoi d\'un signal vers l\'Antre...');
      const response = await axios.get(REGISTRY_URL);
      console.log(`✅ Réponse de l'Antre : "${response.data}"`);
    } catch (error) {
      console.error('❌ Impossible de joindre l\'Antre du Dragon.');
      console.error('   Assurez-vous que le Registre est bien démarré.');
    }
  });

program.parse(process.argv);
