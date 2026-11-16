
"use strict";

// Identifiants conservés uniquement en mémoire.
// Aucun mot de passe n'est enregistré dans le stockage local.
let informationsBasic = null;

const ecranConnexion = document.getElementById("ecran-connexion");
const application = document.getElementById("application");

const formulaire = document.getElementById("formulaire-connexion");
const champUtilisateur = document.getElementById("nom-utilisateur");
const champMotDePasse = document.getElementById("mot-de-passe");
const messageConnexion = document.getElementById("message-connexion");
const boutonConnexion = document.getElementById("bouton-connexion");

const boutonDeconnexion = document.getElementById("bouton-deconnexion");
const utilisateurConnecte = document.getElementById("utilisateur-connecte");

const panneauResultat = document.getElementById("panneau-resultat");
const titreResultat = document.getElementById("titre-resultat");
const valeurResultat = document.getElementById("valeur-resultat");

// Envoie une requête avec l'en-tête HTTP Basic.
function envoyerRequete(url, identifiants = informationsBasic) {
    return fetch(url, {
        method: "GET",
        headers: {
            Authorization: "Basic " + identifiants
        },
        credentials: "omit",
        cache: "no-store"
    });
}

// Connexion avec les informations saisies.
formulaire.addEventListener("submit", async function (evenement) {
    evenement.preventDefault();

    const utilisateur = champUtilisateur.value.trim();
    const motDePasse = champMotDePasse.value;

    if (!utilisateur || !motDePasse) {
        messageConnexion.textContent =
            "Veuillez remplir tous les champs.";
        return;
    }

    messageConnexion.textContent = "";
    boutonConnexion.disabled = true;
    boutonConnexion.textContent = "Vérification en cours...";

    // Les comptes de démonstration utilisent des caractères ASCII.
    const identifiants = btoa(utilisateur + ":" + motDePasse);

    try {
        // La requête valide les identifiants auprès de Spring Security.
        const reponse = await envoyerRequete(
            "/temperature-converter/celsius-fahrenheit/0",
            identifiants
        );

        if (reponse.status === 401) {
            messageConnexion.textContent =
                "Nom d'utilisateur ou mot de passe incorrect.";
            return;
        }

        if (!reponse.ok) {
            messageConnexion.textContent =
                "La connexion a échoué. Veuillez réessayer.";
            return;
        }

        // La connexion a réussi.
        informationsBasic = identifiants;

        utilisateurConnecte.textContent =
            "Connecté : " + utilisateur;

        formulaire.reset();
        messageConnexion.textContent = "";

        ecranConnexion.hidden = true;
        application.hidden = false;

        panneauResultat.hidden = true;

    } catch (erreur) {
        messageConnexion.textContent =
            "Impossible de communiquer avec le serveur.";
    } finally {
        boutonConnexion.disabled = false;
        boutonConnexion.innerHTML =
            'Se connecter <span aria-hidden="true">→</span>';
    }
});

// Déconnexion de l'interface.
function deconnecter() {
    informationsBasic = null;

    formulaire.reset();
    panneauResultat.hidden = true;

    application.hidden = true;
    ecranConnexion.hidden = false;

    messageConnexion.textContent = "";
    champUtilisateur.focus();
}

boutonDeconnexion.addEventListener("click", deconnecter);

// Conserver les deux boutons de conversion existants.
// Chaque requête inclut les identifiants HTTP Basic.
document.querySelectorAll(".cards a.button").forEach(function (lien) {

    lien.addEventListener("click", async function (evenement) {
        evenement.preventDefault();

        if (!informationsBasic) {
            deconnecter();
            return;
        }

        const url = lien.getAttribute("href");
        const versFahrenheit = url.includes("celsius-fahrenheit");

        titreResultat.textContent = "Conversion en cours...";
        valeurResultat.textContent = "";
        panneauResultat.hidden = false;

        try {
            const reponse = await envoyerRequete(url);

            if (reponse.status === 401) {
                deconnecter();
                messageConnexion.textContent =
                    "Veuillez vous reconnecter.";
                return;
            }

            if (!reponse.ok) {
                throw new Error("Erreur de conversion");
            }

            const texte = await reponse.text();
            const nombre = Number(texte.trim());

            if (!Number.isFinite(nombre)) {
                throw new Error("Réponse invalide");
            }

            const unite = versFahrenheit ? "°F" : "°C";

            titreResultat.textContent = versFahrenheit
                ? "Celsius vers Fahrenheit"
                : "Fahrenheit vers Celsius";

            valeurResultat.textContent =
                nombre.toLocaleString("fr-CA", {
                    maximumFractionDigits: 2
                }) + " " + unite;

            panneauResultat.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            });

        } catch (erreur) {
            titreResultat.textContent =
                "Erreur de conversion";

            valeurResultat.textContent =
                "Impossible d'obtenir le résultat.";
        }
    });
});
