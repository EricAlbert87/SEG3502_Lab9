
# SEG 3502 — Laboratoire 9

## Convertisseur de température sécurisé

API REST développée en Kotlin et Spring Boot.


## Fonctionnalités

- Conversion Celsius vers Fahrenheit.
- Conversion Fahrenheit vers Celsius.
- Authentification HTTP Basic obligatoire pour l'API.
- Deux utilisateurs configurés en mémoire avec Spring Security.
- Page de connexion personnalisée en français.
- Validation des identifiants avec l'API REST.
- Messages d'erreur en français.
- Affichage des résultats dans l'interface Web.
- Déconnexion de l'interface.
- Interface responsive avec une palette bleu-vert.

## Comptes de démonstration

- user1 / pass1
- user2 / pass2

## Prérequis

- JDK 21, accessible avec `java` dans le `PATH` ou configuré avec `JAVA_HOME`.
- Une connexion Internet lors de la première construction pour télécharger Gradle et les dépendances.
- Un navigateur Web pour l'interface et cURL pour les exemples de requêtes HTTP.

Le projet inclut le Gradle Wrapper 8.8 : aucune installation séparée de Gradle n'est nécessaire.
L'API ne nécessite aucune base de données.

Vérifier la version active de Java :

```text
java -version
```

La version affichée doit être Java 21. Exécuter les commandes suivantes depuis le dossier
contenant `build.gradle.kts`, `gradlew` et `gradlew.bat`.

## Exécution

### Windows PowerShell

```powershell
.\gradlew.bat clean build
.\gradlew.bat bootRun
```

### macOS et Linux

```bash
chmod +x gradlew
./gradlew clean build
./gradlew bootRun
```

Ouvrir http://localhost:8080.

La commande `clean build` compile le projet et exécute les tests. La commande `bootRun`
démarre le serveur sur le port 8080 et reste active. Pour l'arrêter, appuyer sur `Ctrl+C`
dans le terminal du serveur.

Les services REST restent accessibles à partir de
/temperature-converter/ et exigent HTTP Basic.

La page HTML est une interface de démonstration.
Pour une utilisation en production, HTTPS et
une gestion des identifiants adaptée sont nécessaires.


## Exemples de requêtes HTTP

Garder le serveur actif et ouvrir un deuxième terminal. Les commandes ci-dessous utilisent
`curl.exe` dans Windows PowerShell pour appeler directement cURL. Sur macOS et Linux,
remplacer `curl.exe` par `curl`.

Celsius vers Fahrenheit, avec `user1` : réponse HTTP **200**, corps `122.0`.

```powershell
curl.exe -i -u user1:pass1 http://localhost:8080/temperature-converter/celsius-fahrenheit/50
```

Fahrenheit vers Celsius, avec `user2` : réponse HTTP **200**, corps `50.0`.

```powershell
curl.exe -i -u user2:pass2 http://localhost:8080/temperature-converter/fahrenheit-celsius/122
```

Les deux utilisateurs peuvent accéder aux deux opérations. L'option `-i` affiche les
en-têtes et le code HTTP; l'option `-u` fournit les identifiants HTTP Basic.

### Requêtes refusées

Sans identifiants : réponse HTTP **401**.

```powershell
curl.exe -i http://localhost:8080/temperature-converter/celsius-fahrenheit/50
```

Avec un mot de passe incorrect : réponse HTTP **401**.

```powershell
curl.exe -i -u user1:mauvais http://localhost:8080/temperature-converter/fahrenheit-celsius/122
```

Avec un utilisateur inconnu : réponse HTTP **401**.

```powershell
curl.exe -i -u inconnu:pass1 http://localhost:8080/temperature-converter/celsius-fahrenheit/50
```

### Valeur non numérique

Avec des identifiants valides et une valeur non numérique : réponse HTTP **400**,
corps `La valeur fournie doit être un nombre valide.`.

```powershell
curl.exe -i -u user1:pass1 http://localhost:8080/temperature-converter/celsius-fahrenheit/abc
```

## Tests automatiques

Windows PowerShell :

```powershell
.\gradlew.bat test
```

macOS et Linux :

```bash
./gradlew test
```

Les tests MockMvc démarrent le contexte Spring et vérifient l'API sans nécessiter un serveur
lancé avec `bootRun`. La suite de sécurité couvre les scénarios suivants :

| Scénario | Résultat attendu | Couverture |
| --- | --- | --- |
| Aucun identifiant | HTTP 401 | Les deux opérations |
| Identifiants valides | HTTP 200 et résultat de conversion exact | Chaque utilisateur sur les deux opérations |
| Mot de passe incorrect | HTTP 401 | Les deux opérations |
| Utilisateur inconnu | HTTP 401 | Les deux opérations |
| Valeur non numérique avec authentification valide | HTTP 400 et message en français | Les deux opérations |

Le rapport détaillé est disponible dans `build/reports/tests/test/index.html` après l'exécution.
