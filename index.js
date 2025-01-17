const { spawn } = require("child_process");
const log = require("./logger/log.js");
const fs = require("fs"); // Pour vérifier les fichiers
const login = require("fb-chat-api");

const configPath = "./config.dev.json";
const cookiesPath = "./account.dev.json";

// Valider les fichiers requis
if (!fs.existsSync(configPath)) {
  console.error("Fichier config.json introuvable !");
  process.exit(1);
}

if (!fs.existsSync(cookiesPath)) {
  console.error("Fichier cookies.json introuvable !");
  process.exit(1);
}

const config = require(configPath);

function startProject() {
  const child = spawn("node", ["Goat.js"], {
    cwd: __dirname,
    stdio: "inherit",
    shell: true,
  });

  child.on("close", (code) => {
    if (code === 2) {
      log.info("Restarting Project...");
      startProject();
    }
  });
}

function notifyCreator(apiInstance) {
  const creatorId = config.adminBot?.[0]; // Vérifier l'existence de adminBot
  const message = "Le bot est maintenant en ligne !";

  if (!creatorId) {
    console.error("ID du créateur introuvable dans config.json.");
    return;
  }

  apiInstance.sendMessage(message, creatorId, (err) => {
    if (err) {
      console.error("Erreur lors de l'envoi du message au créateur :", err);
    } else {
      console.log("Notification envoyée au créateur.");
    }
  });
}

function initializeBot() {
  login({ appState: require(cookiesPath) }, (err, apiInstance) => {
    if (err) {
      console.error("Erreur de connexion :", err);
      return;
    }

    console.log("Connexion réussie via les cookies !");
    apiInstance.listenMqtt((err) => {
      if (err) {
        console.error("Erreur lors du démarrage de l'écoute :", err);
      } else {
        console.log("Bot démarré.");
        notifyCreator(apiInstance);
      }
    });
  });
}

// Démarrer le projet et le bot
try {
  startProject();
  initializeBot();
} catch (e) {
  console.error("Une erreur inattendue est survenue :", e);
}
