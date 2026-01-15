import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO pour la mise à jour d'un produit
 * Tous les champs sont optionnels
 */
export class UpdateProductDto {
  @ApiProperty({
    example: 'Laptop Pro',
    description: 'Nom du produit',
    required: false,
  })
  name?: string;

  @ApiProperty({
    example: 'Updated description',
    description: 'Description du produit',
    required: false,
  })
  description?: string;

  @ApiProperty({
    example: 1499.99,
    description: 'Prix du produit',
    required: false,
  })
  price?: number;

  @ApiProperty({
    example: 20,
    description: 'Quantité disponible',
    required: false,
  })
  quantity?: number;
}
