import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;
  const DATA_FILE = join(process.cwd(), 'data', 'products.json');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [ProductsService],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
    // Initialiser avec un fichier vierge
    writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  });

  afterEach(() => {
    try {
      unlinkSync(DATA_FILE);
    } catch (e) {
      // File doesn't exist
    }
  });

  describe('create', () => {
    it('devrait créer un produit via le contrôleur', () => {
      const createProductDto = {
        name: 'New Product',
        description: 'New Description',
        price: 99.99,
        quantity: 20,
      };

      const result = controller.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('New Product');
    });
  });

  describe('findAll', () => {
    it('devrait retourner tous les produits', () => {
      controller.create({
        name: 'Product 1',
        description: 'Desc 1',
        price: 50,
        quantity: 10,
      });
      controller.create({
        name: 'Product 2',
        description: 'Desc 2',
        price: 75,
        quantity: 15,
      });

      const result = controller.findAll();

      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Product 1');
    });
  });

  describe('findOne', () => {
    it('devrait retourner un produit spécifique', () => {
      controller.create({
        name: 'Specific Product',
        description: 'Test',
        price: 100,
        quantity: 5,
      });

      const result = controller.findOne('1');

      expect(result).toBeDefined();
      expect(result.name).toBe('Specific Product');
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un produit', () => {
      controller.create({
        name: 'Original',
        description: 'Original Desc',
        price: 100,
        quantity: 5,
      });

      const result = controller.update('1', {
        name: 'Updated',
        price: 150,
      });

      expect(result.name).toBe('Updated');
      expect(result.price).toBe(150);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un produit', () => {
      controller.create({
        name: 'To Delete',
        description: 'Test',
        price: 50,
        quantity: 10,
      });

      const result = controller.remove('1');

      expect(result.message).toContain('supprimé');
      expect(controller.findAll().length).toBe(0);
    });
  });
});
