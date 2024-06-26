import { Module } from '@nestjs/common';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';

@Module({
  controllers: [ProductController],
  providers: [
    ProductService,
    PrismaService,
    PaginationService,
    ValidatorService,
  ],
})
export class ProductModule {}
