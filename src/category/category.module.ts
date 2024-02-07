import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, PrismaService, ValidatorService],
})
export class CategoryModule {}
