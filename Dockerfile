# Utiliser une image de base Node.js
FROM node:16

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers de package et installer les dépendances
COPY package*.json ./
RUN npm install

# Copier le reste des fichiers de l'application
COPY . .

# Exposer le port 1234
EXPOSE 1234

# Commande pour démarrer l'application
CMD [ "npm", "run", "start" ]
