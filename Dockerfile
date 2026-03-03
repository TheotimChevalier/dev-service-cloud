# Utiliser une image de base Node.js
FROM node:22

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port attendu par Cloud Run (et par l'application)
EXPOSE 8080

# Commande pour démarrer l'application
CMD [ "npm", "run", "start" ]
