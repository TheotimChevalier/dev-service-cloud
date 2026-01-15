import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';

describe('ProductsService', () => {
  let service: ProductsService;
  const DATA_FILE = join(process.cwd(), 'data', 'products.json');

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

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
    it('devrait créer un produit avec succès', () => {
      const createProductDto = {
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        quantity: 5,
      };

      const result = service.create(createProductDto);

      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Product');
      expect(result.price).toBe(100);
      expect(result.createdAt).toBeDefined();
    });

    it('devrait lever une exception si le nom est manquant', () => {
      const createProductDto = {
        name: '',
        description: 'Test',
        price: 100,
        quantity: 5,
      };

      expect(() => service.create(createProductDto)).toThrow(
        BadRequestException,
      );
    });
  });

  describe('findAll', () => {
    it('devrait retourner un tableau vide initialement', () => {
      const result = service.findAll();
      expect(result).toEqual([]);
    });

    it('devrait retourner tous les produits', () => {
      service.create({
        name: 'Product 1',
        description: 'Desc 1',
        price: 100,
        quantity: 5,
      });
      service.create({
        name: 'Product 2',
        description: 'Desc 2',
        price: 200,
        quantity: 10,
      });

      const result = service.findAll();
      expect(result.length).toBe(2);
      expect(result[0].name).toBe('Product 1');
      expect(result[1].name).toBe('Product 2');
    });
  });

  describe('findOne', () => {
    it('devrait retourner un produit par son ID', () => {
      service.create({
        name: 'Test Product',
        description: 'Test',
        price: 100,
        quantity: 5,
      });

      const result = service.findOne(1);
      expect(result).toBeDefined();
      expect(result.id).toBe(1);
      expect(result.name).toBe('Test Product');
    });

    it('devrait lever une exception si le produit n\'existe pas', () => {
      expect(() => service.findOne(999)).toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('devrait mettre à jour un produit', () => {
      service.create({
        name: 'Original Name',
        description: 'Original Desc',
        price: 100,
        quantity: 5,
      });

      const result = service.update(1, {
        name: 'Updated Name',
        price: 150,
      });

      expect(result.name).toBe('Updated Name');
      expect(result.price).toBe(150);
      expect(result.description).toBe('Original Desc');
    });

    it('devrait lever une exception si le produit n\'existe pas', () => {
      expect(() =>
        service.update(999, { name: 'Updated Name' }),
      ).toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('devrait supprimer un produit', () => {
      service.create({
        name: 'Product to delete',
        description: 'Test',
        price: 100,
        quantity: 5,
      });

      const result = service.remove(1);
      expect(result.message).toContain('supprimé');
      expect(service.findAll().length).toBe(0);
    });

    it('devrait lever une exception si le produit n\'existe pas', () => {
      expect(() => service.remove(999)).toThrow(NotFoundException);
    });
  });
});
