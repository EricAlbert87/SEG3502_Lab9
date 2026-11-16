
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

## Exécution

```bash id="9srxep"
./gradlew clean build
./gradlew bootRun
```

Ouvrir http://localhost:8080.

Les services REST restent accessibles à partir de
/temperature-converter/ et exigent HTTP Basic.

La page HTML est une interface de démonstration.
Pour une utilisation en production, HTTPS et
une gestion des identifiants adaptée sont nécessaires.


### Exemples

Celsius vers Fahrenheit :

```bash
curl -u user1:pass1 http://localhost:8080/temperature-converter/celsius-fahrenheit/50
```

Fahrenheit vers Celsius :

```bash
curl -u user2:pass2 http://localhost:8080/temperature-converter/fahrenheit-celsius/122
```

### Vérification

```bash
./gradlew test
```

L'API ne nécessite aucune base de données.
