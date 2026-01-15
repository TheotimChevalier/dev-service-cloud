# 📋 Guide de Configuration GitHub

## Étapes pour créer le dépôt GitHub

### 1. Créer le dépôt GitHub
1. Connectez-vous à votre compte GitHub
2. Cliquez sur le bouton **"+"** en haut à droite et sélectionnez **"New repository"**
3. Nommez le dépôt: `cloud-app`
4. Sélectionnez **"Private"** (dépôt privé)
5. Cliquez sur **"Create repository"**

### 2. Ajouter le dépôt distant (remote)
```bash
git remote add origin https://github.com/VOTRE_USERNAME/cloud-app.git
git branch -M main
git push -u origin main
```

### 3. Ajouter les collaborateurs
1. Allez sur votre dépôt GitHub
2. Cliquez sur **"Settings"** > **"Collaborators"**
3. Cliquez sur **"Add people"**
4. Entrez l'email: `pro.bryanbreton@gmail.com`
5. Sélectionnez le rôle **"Maintain"** ou **"Push"**
6. Cliquez sur **"Add pro.bryanbreton@gmail.com to this repository"**

Le contributeur recevra une invitation par email et pourra accéder au dépôt une fois qu'il l'aura acceptée.

## 🔐 Note sur la sécurité
- Assurez-vous que le dépôt est **PRIVÉ**
- Vérifiez que seules les personnes autorisées ont accès
- Ne commitez jamais de secrets ou d'identifiants dans le code

## 📦 Contenu du dépôt
Le dépôt contient:
- ✅ Code source complet et commenté
- ✅ Module CRUD fonctionnel
- ✅ Tests unitaires (16 tests passants)
- ✅ Documentation Swagger interactive
- ✅ README.md clair et complet
- ✅ .gitignore adapté à Node.js/NestJS
- ✅ Historique Git avec messages clairs
