import { Prisma } from '@prisma/client';
import {
  ArrayMinSize,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PaginationDto } from 'src/pagination/pagination.dto';

export class ProductDto implements Prisma.ProductUpdateInput {
  @IsString()
  name: string;

  @IsNumber()
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString({ each: true })
  @ArrayMinSize(1)
  images?: string[];

  @IsNumber()
  categoryId: number;
}

export enum OrderBy {
  HIGH_PRICE = 'high-price',
  LOW_PRICE = 'low-price',
  NEWEST = 'newest',
  OLDEST = 'oldest',
}

export class GetAllProductDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderBy)
  sort?: OrderBy;

  @IsOptional()
  @IsString()
  searchTerm?: string;
}
