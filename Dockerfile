# build stage
FROM node:22-alpine AS builder
WORKDIR /usr/src/app

# installer les dépendances de build
COPY package*.json ./
RUN npm ci

# copier le code et compiler
COPY . .
RUN npm run build

# production stage
FROM node:22-alpine
WORKDIR /usr/src/app

# n'installer que les dépendances de prod
COPY package*.json ./
RUN npm ci --only=production

# copier l'application compilée
COPY --from=builder /usr/src/app/dist ./dist

# exposer le port attendu par Cloud Run et par l'app
EXPOSE 8080

# démarrer le serveur Node.js pointant vers le build
CMD [ "node", "dist/main.js" ]
