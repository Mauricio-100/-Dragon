#!/usr/bin/env node

const { Command } = require('commander');
const axios = require('axios');
const program = new Command();

// Définir l'URL de notre Registre

// LIGNE CORRIGÉE
const REGISTRY_URL = 'http://127.0.0.1:3000';

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
// --- NOUVEAU CODE À AJOUTER ---
const fs = require('fs');
const path = require('path');
const archiver = require('archiver');
const FormData = require('form-data');

// Créer la commande "publish"
program
  .command('publish')
  .description('Compresse et publie le paquet dans l\'Antre du Dragon.')
  .action(async () => {
    console.log('🔥 Préparation du paquet pour le vol...');

    // 1. Lire le dragon.json (ou package.json pour ce test)
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.error('❌ Erreur : Fichier package.json non trouvé. Êtes-vous dans un projet Dragon ?');
      return;
    }
    const packageInfo = require(packageJsonPath);
    const packageName = packageInfo.name.replace('/', '-'); // Remplacer les / pour un nom de fichier valide
    const packageVersion = packageInfo.version;
    const fileName = `${packageName}-${packageVersion}.tgz`;

    // 2. Créer une archive .tgz
    const output = fs.createWriteStream(fileName);
    const archive = archiver('tar', {
      gzip: true,
    });

    // Pipe de sortie
    archive.pipe(output);

    // Ajouter tous les fichiers du projet à l'archive (sauf les node_modules et le .tgz lui-même)
    archive.glob('**/*', {
      cwd: process.cwd(),
      ignore: ['node_modules/**', fileName]
    });

    console.log('📦 Compression du projet en cours...');
    await archive.finalize();

    // Attendre que le fichier soit bien écrit
    output.on('close', async () => {
      console.log(`✅ Paquet compressé : ${fileName} (${archive.pointer()} bytes)`);

      // 3. Envoyer l'archive au Registre
      const form = new FormData();
      form.append('package', fs.createReadStream(fileName));

      try {
        console.log('🚀 Envoi du paquet vers l\'Antre...');
        const response = await axios.post(`${REGISTRY_URL}/publish`, form, {
          headers: form.getHeaders(),
        });
        console.log(`🎉 Réponse de l'Antre : "${response.data}"`);
      } catch (error) {
        console.error('❌ Échec de la publication.');
        if (error.response) {
          console.error(`   Message du serveur : ${error.response.data}`);
        }
      } finally {
        // 4. Nettoyer le fichier .tgz
        fs.unlinkSync(fileName);
        console.log('🧹 Nettoyage terminé.');
      }
    });
  });
// --- FIN DU NOUVEAU CODE ---
program.parse(process.argv);
