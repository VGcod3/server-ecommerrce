import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.guard';
import { GetAllProductDto, ProductDto } from './product.dto';
import { ProductService } from './product.service';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UsePipes(new ValidationPipe())
  @Get()
  async getAll(@Query() dto: GetAllProductDto) {
    return this.productService.getAll(dto);
  }

  @Get(':id')
  async getById(@Param('id') productId: string) {
    return this.productService.getById(+productId);
  }

  @Get('simmilar/:id')
  async getRelatedProducts(@Param('id') productId: string) {
    return this.productService.getRelatedProducts(+productId);
  }

  @Get('by-slug/:slug')
  async getBySlug(@Param('slug') slug: string) {
    return this.productService.getBySlug(slug);
  }

  @Get('by-category/:categorySlug')
  async getByCategory(@Param('categorySlug') categorySlug: string) {
    return this.productService.getByCategory(categorySlug);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post()
  async create(@Body() dto: ProductDto) {
    return this.productService.create(dto);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Put(':id')
  async update(@Param('id') productId: string, @Body() dto: ProductDto) {
    return this.productService.update(+productId, dto);
  }

  @Auth()
  @Delete(':id')
  async delete(@Param('id') productId: string) {
    return this.productService.delete(+productId);
  }
}
