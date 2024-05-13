import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { ValidatorService } from 'src/validator/validator.service';
import { CategoryDto } from './category.dto';
import { returnCategoryObject } from './return-category';

@Injectable()
export class CategoryService {
  constructor(
    private prisma: PrismaService,
    private validator: ValidatorService,
  ) {}

  async byId(id: number) {
    return await this.validator.validateCategoryExistence({ id });
  }

  async bySlug(slug: string) {
    return await this.validator.validateCategoryExistence({ slug });
  }

  async update(id: number, dto: CategoryDto) {
    await this.validator.validateCategoryExistence({ id });

    return await this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async delete(categoryId: number /*, userId: number */) {
    await this.validator.validateCategoryExistence({ id: categoryId });

    return await this.prisma.category.delete({
      where: { id: categoryId },
    });
  }

  async create(dto: CategoryDto) {
    await this.validator.validateCategoryUnique(dto.name);

    return await this.prisma.category.create({
      data: {
        name: dto.name,
        slug: generateSlug(dto.name),
      },
    });
  }

  async getAll() {
    return await this.prisma.category.findMany({
      select: returnCategoryObject,
    });
  }
}
