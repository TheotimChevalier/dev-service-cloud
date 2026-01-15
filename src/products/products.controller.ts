import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './interfaces/product.interface';

@ApiTags('products')
@Controller('items')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  /**
   * Récupère tous les produits
   */
  @Get()
  @ApiOperation({ summary: 'Liste tous les éléments' })
  @ApiResponse({
    status: 200,
    description: 'Liste des produits',
    type: [Object],
  })
  findAll(): Product[] {
    return this.productsService.findAll();
  }

  /**
   * Récupère un produit par son ID
   */
  @Get(':id')
  @ApiOperation({ summary: 'Liste un élément via son id' })
  @ApiResponse({
    status: 200,
    description: 'Produit trouvé',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  findOne(@Param('id') id: string): Product {
    return this.productsService.findOne(parseInt(id, 10));
  }

  /**
   * Crée un nouveau produit
   */
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: 'Créer un élément' })
  @ApiResponse({
    status: 201,
    description: 'Produit créé',
    type: Object,
  })
  @ApiResponse({ status: 400, description: 'Données invalides' })
  create(@Body() createProductDto: CreateProductDto): Product {
    return this.productsService.create(createProductDto);
  }

  /**
   * Met à jour un produit
   */
  @Put(':id')
  @ApiOperation({ summary: 'Modifie un élément via son id' })
  @ApiResponse({
    status: 200,
    description: 'Produit mis à jour',
    type: Object,
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ): Product {
    return this.productsService.update(parseInt(id, 10), updateProductDto);
  }

  /**
   * Supprime un produit
   */
  @Delete(':id')
  @ApiOperation({ summary: 'Supprime un élément via son id' })
  @ApiResponse({
    status: 200,
    description: 'Produit supprimé',
  })
  @ApiResponse({ status: 404, description: 'Produit non trouvé' })
  remove(@Param('id') id: string): { message: string; id: number } {
    return this.productsService.remove(parseInt(id, 10));
  }
}
