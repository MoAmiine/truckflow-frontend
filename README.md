# TruckFlow — Frontend React 

Interface web React (Vite) de gestion de flotte pour l'entreprise de transport .
Supporte deux rôles distincts : **Administrateur** et **Chauffeur**.

## Lancement du projet
```bash
# Installation des dépendances
npm install

# Démarrage du serveur de développement (Port 5173)
npm run dev

# Build de production
npm run build
```

## Configuration API & CORS
* **Base URL :** `http://localhost:5001/api/v1`
* **CORS :** Autorise `http://localhost:5173` avec en-têtes `Authorization` et `credentials: true`.

## Fiche de Contrat Backend

| Point à relever | Information documentée |
| :--- | :--- |
| **Connexion (US01)** | `POST /api/v1/auth/login` <br> Body: `{ "email": "...", "password": "..." }` <br> Réponse: `{ status: "success", data: { id, nom, prenom, email, role, statut, accessToken, refreshToken } }` |
| **Session & Rafraîchissement** | Header `Authorization: Bearer <accessToken>` <br> Rafraîchissement: `POST /api/v1/auth/refresh` `{ refreshToken }` |
| **Identité & Rôle** | Champ `role` (`"admin"` \| `"chauffeur"`) renvoyé à la connexion et via `GET /api/v1/auth/me` |
| **Déconnexion (US08)** | `POST /api/v1/auth/logout` (Header Bearer), effacement mémoire de la session |
| **Utilisateurs (US02/03/04)** | `GET /api/v1/users` (Liste complète) <br> `POST /api/v1/users/chauffeurs` (Créer chauffeur) <br> `PATCH /api/v1/users/:id/statut` (Suspendre/Activer) |
| **Camions (US05)** | `GET /api/v1/camions` (Liste) <br> `POST /api/v1/camions` (Créer) <br> `PUT /api/v1/camions/:id` (Éditer) <br> `DELETE /api/v1/camions/:id` (Archiver) |
| **Mes Trajets (US06)** | `GET /api/v1/trajets/mes-trajets` (Trajets assignés au chauffeur connecté) |
| **Format Erreurs (US07)** | `{ "status": "fail", "statusCode": 4xx, "message": "..." }` <br> `401` = Session expirée / Identifiants invalides <br> `403` = Accès refusé / Chauffeur suspendu |

## Comptes de Vérification
* **Admin :** `admin@truckflow.com` / `admin123456`
* **Chauffeur Actif :** `chauffeur@truckflow.com` / `chauffeur123456`
* **Chauffeur Suspendu :** `suspendu@truckflow.com` / `chauffeur123456`
