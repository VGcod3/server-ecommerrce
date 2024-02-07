import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Auth } from 'src/auth/auth.guard';
import { CategoryDto } from './category.dto';
import { CategoryService } from './category.service';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Auth()
  @Get(':id')
  async byId(@Param('id') categoryId: string) {
    return await this.categoryService.byId(+categoryId);
  }

  @Get('by-slug/:slug')
  async bySlug(@Param('slug') slug: string) {
    return await this.categoryService.bySlug(slug);
  }

  @Get()
  async getAll() {
    return await this.categoryService.getAll();
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Put(':id')
  async update(@Param('id') categoryId: string, @Body() dto: CategoryDto) {
    return await this.categoryService.update(+categoryId, dto);
  }

  @Auth()
  @Delete(':id')
  async delete(
    @Param('id') categoryId: string,
    // @CurrentUser('id') userId: number,
  ) {
    return await this.categoryService.delete(+categoryId /* , userId */);
  }

  @UsePipes(new ValidationPipe())
  @Auth()
  @Post()
  async create(@Body() dto: CategoryDto) {
    return await this.categoryService.create(dto);
  }
}
