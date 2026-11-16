
# SEG 3502 — Laboratoire 9

## Convertisseur de température sécurisé

API REST développée en Kotlin et Spring Boot.

### Fonctionnalités

- Conversion Celsius vers Fahrenheit.
- Conversion Fahrenheit vers Celsius.
- Authentification HTTP Basic obligatoire.
- Authentification en mémoire avec deux utilisateurs.
- Page de présentation en français.

### Utilisateurs de démonstration

- user1 / pass1
- user2 / pass2

### Exécution

Java 21 est nécessaire.

```bash
chmod +x gradlew
./gradlew clean build
./gradlew bootRun
```

Application : http://localhost:8080

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
