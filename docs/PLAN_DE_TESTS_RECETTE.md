# Plan de Tests Manuels, Accessibilité & Recette Finale (US-F09 / TF-41)

Ce document formalise la recette fonctionnelle, technique et ergonomique de l'application **FleetTrackPRO** pour la soutenance finale.

---

## 1. Environnement & Comptes de Recette

| Rôle | Identifiant | Mot de passe | Rôle attendu | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **Administrateur** | `admin@truckflow.com` | `admin123456` | `admin` | Actif |
| **Chauffeur Actif** | `chauffeur@truckflow.com` | `chauffeur123456` | `chauffeur` | Actif |
| **Chauffeur Suspendu** | `suspendu@truckflow.com` | `chauffeur123456` | `chauffeur` | Suspendu |

---

## 2. Matrice des Scénarios de Test

### Scénario 1 : Authentification & Contrôle d'Accès (US01 / US07)
* **Étape 1 :** Connexion avec identifiants invalides (`test@fail.com` / `mauvais`).
  * *Résultat attendu :* Erreur 401 affichée, champs saisis conservés.
* **Étape 2 :** Connexion avec `admin@truckflow.com`.
  * *Résultat attendu :* Session initialisée, affichage de l'Espace Administration (Utilisateurs et Camions), masquage de l'Espace Chauffeur.
* **Étape 3 :** Déconnexion (`POST /api/v1/auth/logout`).
  * *Résultat attendu :* Session purgée en mémoire et token révoqué en base.

### Scénario 2 : Espace Chauffeur & Isolation des Données (US06)
* **Étape 1 :** Connexion avec `chauffeur@truckflow.com`.
  * *Résultat attendu :* Affichage exclusif de l'Espace Chauffeur, aucune commande admin rendue.
* **Étape 2 :** Clic sur "Consulter mes trajets" (`GET /api/v1/trajets/mes-trajets`).
  * *Résultat attendu :* Liste des trajets assignés au chauffeur connecté uniquement.

### Scénario 3 : Gestion des Utilisateurs & Révocation (US02 / US03 / US04)
* **Étape 1 :** Chargement de la liste des utilisateurs et filtrage par statut / rôle.
* **Étape 2 :** Création d'un nouveau chauffeur (`POST /api/v1/users/chauffeurs`).
  * *Résultat attendu :* Ajout réactif en tête de liste, réinitialisation du formulaire.
* **Étape 3 :** Suspension / Réactivation (`PATCH /api/v1/users/:id/statut`).
  * *Résultat attendu :* Changement de badge immédiat (`actif` <-> `suspendu`).

### Scénario 4 : Gestion du Parc Camions (US05)
* **Étape 1 :** Chargement et filtrage par statut (`disponible`, `en_mission`, `maintenance`).
* **Étape 2 :** Ajout d'un nouveau camion (`POST /api/v1/camions`).
* **Étape 3 :** Édition d'un camion existant (`PUT /api/v1/camions/:id`).
* **Étape 4 :** Archivage avec confirmation (`DELETE /api/v1/camions/:id`).
  * *Résultat attendu :* Suppression de la liste active.

---

## 3. Preuve de Refus 403 Backend (Sécurité RBAC)

Toute tentative d'un chauffeur d'accéder aux routes d'administration (`/api/v1/users` ou `/api/v1/camions`) renvoie une réponse HTTP 403 :
```json
{
  "status": "fail",
  "statusCode": 403,
  "message": "Accès interdit : vous n'avez pas les autorisations nécessaires"
}
```
L'interface frontend capture cette réponse sans détruire la session existante et affiche le panneau `Accès Refusé`.

---

## 4. Vérification Ergonomie, Clavier & Responsive

* **Navigation au clavier :** Tous les boutons et champs de saisie possèdent un contour d'accessibilité (`:focus-visible`) clair et sont accessibles via la touche `Tab`.
* **Ergonomie Mobile :** La grille (`gridTemplateColumns`) s'adapte automatiquement sur écran réduit (`auto-fill, minmax`), sans aucun défilement horizontal.
* **Build de production :** Vérifié avec succès via `npm run build` (0 erreurs, 0 avertissements).
