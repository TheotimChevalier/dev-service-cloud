import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la création d'un produit
 * Contient les champs requis pour créer un nouveau produit
 */
export class CreateProductDto {
  @ApiProperty({ example: 'Laptop', description: 'Nom du produit' })
  name: string;

  @ApiProperty({
    example: 'High-performance laptop',
    description: 'Description du produit',
  })
  description: string;

  @ApiProperty({ example: 1299.99, description: 'Prix du produit' })
  price: number;

  @ApiProperty({ example: 10, description: 'Quantité disponible' })
  quantity: number;
}
