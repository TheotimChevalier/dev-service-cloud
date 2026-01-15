# Test API - Cloud App

Ce fichier documente les tests manuels de l'API.

## Prérequis
- L'application doit être lancée avec `npm run start:dev`
- Les requêtes peuvent être testées avec curl, Postman ou tout autre client HTTP

## Endpoints disponibles

### 1. Créer un produit (POST /items)
```bash
curl -X POST http://localhost:3000/items \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Dell XPS",
    "description": "High-performance laptop for development",
    "price": 1299.99,
    "quantity": 5
  }'
```

Réponse attendue:
```json
{
  "id": 1,
  "name": "Laptop Dell XPS",
  "description": "High-performance laptop for development",
  "price": 1299.99,
  "quantity": 5,
  "createdAt": "2026-01-15T13:40:00.000Z",
  "updatedAt": "2026-01-15T13:40:00.000Z"
}
```

### 2. Récupérer tous les produits (GET /items)
```bash
curl http://localhost:3000/items
```

Réponse attendue: Un tableau de produits

### 3. Récupérer un produit spécifique (GET /items/:id)
```bash
curl http://localhost:3000/items/1
```

### 4. Mettre à jour un produit (PUT /items/:id)
```bash
curl -X PUT http://localhost:3000/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 1199.99,
    "quantity": 10
  }'
```

### 5. Supprimer un produit (DELETE /items/:id)
```bash
curl -X DELETE http://localhost:3000/items/1
```

## Documentation Swagger

Une documentation interactive Swagger est disponible à:
```
http://localhost:3000
```

Vous pouvez tester tous les endpoints directement depuis le navigateur.
