/**
 * @author NTKhang
 * ! The source code is written by NTKhang, please don't change the author's name everywhere. Thank you for using
 * ! Official source code: https://github.com/ntkhang03/Goat-Bot-V2
 * ! If you do not download the source code from the above address, you are using an unknown version and at risk of having your account hacked
 *
 * English:
 * ! Please do not change the below code, it is very important for the project.
 * It is my motivation to maintain and develop the project for free.
 * ! If you change it, you will be banned forever
 * Thank you for using
 *
 * Vietnamese:
 * ! Vui lòng không thay đổi mã bên dưới, nó rất quan trọng đối với dự án.
 * Nó là động lực để tôi duy trì và phát triển dự án miễn phí.
 * ! Nếu thay đổi nó, bạn sẽ bị cấm vĩnh viễn
 * Cảm ơn bạn đã sử dụng
 */

const { spawn } = require("child_process");
const log = require("./logger/log.js");

function startProject() {
	const child = spawn("node", ["Goat.js"], {
		cwd: __dirname,
		stdio: "inherit",
		shell: true
	});

	child.on("close", (code) => {
		if (code == 2) {
			log.info("Restarting Project...");
			startProject();
		}
	});
}

startProject();
const { api } = require('fb-chat-api'); // Assurez-vous que l'API est correctement importée
const config = require('./config.json'); // Charger la configuration

// Fonction pour notifier le créateur au démarrage
function notifyCreator() {
  const creatorId = config.adminBot[0]; // Récupère l'ID du créateur
  const message = "Le bot est maintenant en ligne !";

  if (creatorId) {
    api.sendMessage(message, creatorId, (err) => {
      if (err) {
        console.error("Erreur lors de l'envoi du message au créateur :", err);
      } else {
        console.log("Notification envoyée au créateur.");
      }
    });
  } else {
    console.error("ID du créateur introuvable.");
  }
}

// Initialisation du bot avec les cookies
const cookiesPath = './cookies.json'; // Chemin du fichier contenant les cookies
const login = require('fb-chat-api');

login({ appState: require(cookiesPath) }, (err, apiInstance) => {
  if (err) return console.error("Erreur de connexion :", err);

  // Sauvegarder l'API pour utilisation
  api = apiInstance;

  console.log("Connexion réussie via les cookies !");
  
  // Démarrage de l'écoute
  api.listenMqtt(() => {
    console.log("Bot démarré.");
    notifyCreator();
  });
});
