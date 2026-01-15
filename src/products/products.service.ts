import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

const DATA_FILE = join(process.cwd(), 'data', 'products.json');

@Injectable()
export class ProductsService {
  constructor() {
    this.ensureDataFile();
  }

  /**
   * Assure que le fichier de données existe
   */
  private ensureDataFile(): void {
    const dataDir = join(process.cwd(), 'data');
    if (!existsSync(dataDir)) {
      require('fs').mkdirSync(dataDir, { recursive: true });
    }
    if (!existsSync(DATA_FILE)) {
      writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
    }
  }

  /**
   * Récupère tous les produits
   */
  findAll(): Product[] {
    const data = readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  }

  /**
   * Récupère un produit par son ID
   */
  findOne(id: number): Product {
    const products = this.findAll();
    const product = products.find((p) => p.id === id);
    if (!product) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas`);
    }
    return product;
  }

  /**
   * Crée un nouveau produit
   */
  create(createProductDto: CreateProductDto): Product {
    const products = this.findAll();

    // Validation basique
    if (!createProductDto.name || !createProductDto.price) {
      throw new BadRequestException('Le nom et le prix sont requis');
    }

    const newProduct: Product = {
      id: products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1,
      ...createProductDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    products.push(newProduct);
    writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    return newProduct;
  }

  /**
   * Met à jour un produit
   */
  update(id: number, updateProductDto: UpdateProductDto): Product {
    const products = this.findAll();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas`);
    }

    products[index] = {
      ...products[index],
      ...updateProductDto,
      updatedAt: new Date(),
    };

    writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    return products[index];
  }

  /**
   * Supprime un produit
   */
  remove(id: number): { message: string; id: number } {
    const products = this.findAll();
    const index = products.findIndex((p) => p.id === id);

    if (index === -1) {
      throw new NotFoundException(`Le produit avec l'ID ${id} n'existe pas`);
    }

    products.splice(index, 1);
    writeFileSync(DATA_FILE, JSON.stringify(products, null, 2));
    return { message: `Produit ${id} supprimé avec succès`, id };
  }
}
