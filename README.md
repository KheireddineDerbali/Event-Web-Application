# Event Management Platform - Modern Pro

Une plateforme de gestion d'événements complète, performante et élégamment conçue avec une esthétique **Modern Pro SaaS**. 

## 🚀 Fonctionnalités
- **Authentification Sécurisée** : JWT avec synchronisation temps réel de la Navbar.
- **Cycle CRUD Complet** : Création, Consultation, Modification et Suppression d'événements.
- **Gestion des Participants** : Inscription en un clic et visualisation des listes d'invités.
- **Design Responsive** : Interface fluide sur desktop et mobile (Indigo/Slate theme).

## ⚙️ Configuration de la Base de Données (Neon)
Cette plateforme utilise **Neon** pour une base de données PostgreSQL serverless.

1.  Créez un compte sur [Neon.tech](https://neon.tech).
2.  Créez un nouveau projet (ex: `event-app`).
3.  Dans votre Dashboard Neon, copiez la **Connection String** (elle ressemble à `postgresql://neondb_owner:password@ep-sky.aws.neon.tech/neondb?sslmode=require`).
4.  Collez cette URL dans le fichier `.env` du backend (voir section ci-dessous).

---

## 🔑 Variables d'Environnement (.env)

### 📦 Backend (`event-backend/.env`)
Créez un fichier `.env` à la racine du dossier `event-backend` :
```env
DATABASE_URL="votre_url_connexion_neon"
JWT_SECRET="votre_cle_secrete_aleatoire"
PORT=3001
```

### 🎨 Frontend (`event-frontend/.env`)
Créez un fichier `.env.local` à la racine du dossier `event-frontend` :
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

---

## 🛠️ Installation et Lancement

### 1. Prérequis
- **Node.js** (v18+)
- **PostgreSQL** (ou une instance Neon DB)

### 2. Backend (NestJS)
Le backend gère l'API REST, l'authentification et la base de données via Prisma.

```bash
cd event-backend
# Installation des dépendances
npm install
# Génération du client Prisma
npx prisma generate
# Lancement en mode développement
npm run start:dev
```
*Le backend sera accessible sur `http://localhost:3001`.*

### 3. Frontend (Next.js)
Le frontend est une application Next.js 16 utilisant Tailwind CSS v4 et shadcn/ui.

```bash
cd event-frontend
# Installation des dépendances
npm install
# Lancement en mode développement
npm run dev
```
*Le frontend sera accessible sur `http://localhost:3000`.*

---

## 📸 Aperçu de l'Application (Screenshots)

### 1. Accueil & Authentification
L'entrée de la plateforme avec un design épuré et un accès rapide.
![Accueil](./screens/acceuil.png)

### 2. Liste des Événements
La grille principale affichant tous les événements à venir.
![Événements](./screens/event.png)

### 3. Création d'un Événement
Interface intuitive pour publier de nouveaux rassemblements.
![Création](./screens/create%20evenements.png)

### 4. Modification d'un Événement
Mise à jour dynamique des informations (accessible au survol des cartes).
![Modification](./screens/modifier%20evenements.png)

### 5. Liste des Participants
Visualisation des inscrits pour chaque événement.
![Participants](./screens/liste%20des%20participants.png)

### 6. Suppression d'un Événement
Confirmation sécurisée pour la gestion des données.
![Suppression](./screens/supprimer%20evenements.png)

---

## 🏗️ Technologies Utilisées
- **Frontend** : Next.js 16, Tailwind CSS v4, Lucide Icons, Shadcn/ui, Sonner (Toasts).
- **Backend** : NestJS, Prisma ORM, Passport.js (JWT).
- **Base de données** : PostgreSQL.
