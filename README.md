# Cloud App - API de Gestion de Produits

Une application NestJS moderne pour la gestion de produits avec CRUD complet, documentation Swagger et tests unitaires.

## 📋 Prérequis

- Node.js 16+ 
- npm 8+
- Git

## 🚀 Installation et démarrage

### Cloner le projet
```bash
git clone <URL-du-repo>
cd cloud-app
```

### Installer les dépendances
```bash
npm install
```

### Lancer l'application en développement
```bash
npm run start:dev
```

L'application sera disponible à: `http://localhost:3000`

La documentation Swagger (interactive) sera accessible à: `http://localhost:3000`

## 📚 Documentation de l'API

### Routes principales (CRUD)

| Méthode | Route | Description |
|---------|-------|-------------|
| GET | `/items` | Liste tous les produits |
| GET | `/items/:id` | Récupère un produit par son ID |
| POST | `/items` | Crée un nouveau produit |
| PUT | `/items/:id` | Met à jour un produit |
| DELETE | `/items/:id` | Supprime un produit |

### Exemple de requête POST
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop",
    "description": "High-performance laptop",
    "price": 1299.99,
    "quantity": 10
  }'
```

## 🧪 Tests

Lancer tous les tests unitaires:
```bash
npm run test
```

Lancer les tests en mode watch:
```bash
npm run test:watch
```

Lancer les tests avec couverture de code:
```bash
npm run test:cov
```

## 📁 Structure du projet

```
src/
├── app.module.ts           # Module principal
├── app.controller.ts       # Contrôleur principal
├── main.ts                 # Point d'entrée avec configuration Swagger
└── products/
    ├── products.module.ts
    ├── products.service.ts      # Logique métier CRUD
    ├── products.controller.ts   # Endpoints REST
    ├── products.service.spec.ts
    ├── products.controller.spec.ts
    ├── dto/
    │   ├── create-product.dto.ts
    │   └── update-product.dto.ts
    └── interfaces/
        └── product.interface.ts
data/
└── products.json           # Fichier JSON pour la persistance des données
```

## 📝 Notes de développement

- Les données sont stockées localement dans `data/products.json`
- Le fichier est créé automatiquement au premier démarrage
- Pas de base de données requise pour cette étape
- Les IDs des produits sont générés automatiquement (auto-incrémentés)

## 🛠️ Scripts disponibles

- `npm run start` - Lancer l'application en mode production
- `npm run start:dev` - Lancer en mode développement avec auto-reload
- `npm run build` - Compiler le projet
- `npm run test` - Lancer les tests unitaires
- `npm run lint` - Vérifier la syntaxe avec ESLint

## 🔄 Workflow de développement

1. Créer une branche: `git checkout -b feat/ma-fonctionnalite`
2. Faire les changements et tester: `npm run test`
3. Commit avec message clair: `git commit -m "feat: add new feature"`
4. Push et ouvrir une Pull Request

## 📦 Technologie utilisée

- **Framework**: NestJS
- **Runtime**: Node.js
- **Language**: TypeScript
- **Testing**: Jest
- **Documentation**: Swagger/OpenAPI

## 👥 Contributrices et contributeurs

Projet développé en groupe de 4 pour le module Cloud Natives.

---

**Version**: 1.0.0  
**Licence**: MIT
