import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PaginationService } from 'src/pagination/pagination.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateSlug } from 'src/utils/generate-slug';
import { ValidatorService } from 'src/validator/validator.service';
import { GetAllProductDto, OrderBy, ProductDto } from './product.dto';
import { returnProductObject } from './return-product';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly paginationSevice: PaginationService,
    private readonly validator: ValidatorService,
  ) {}

  async getAll(dto: GetAllProductDto = [] as unknown as GetAllProductDto) {
    const { sort, searchTerm } = dto;

    const prismaSort: Prisma.ProductOrderByWithRelationInput[] = [];

    if (sort === OrderBy.LOW_PRICE)
      prismaSort.push({
        price: 'asc',
      });
    else if (sort === OrderBy.HIGH_PRICE)
      prismaSort.push({
        price: 'desc',
      });
    else if (sort === OrderBy.OLDEST)
      prismaSort.push({
        createdAt: 'asc',
      });

    const prismaSearchTermFilter: Prisma.ProductWhereInput = searchTerm
      ? {
          OR: [
            {
              category: {
                name: {
                  contains: searchTerm,
                  mode: 'insensitive',
                },
              },
            },
            {
              name: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
            {
              description: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          ],
        }
      : {};

    const { skip, take } = this.paginationSevice.getPagination(dto);

    const products = await this.prisma.product.findMany({
      where: prismaSearchTermFilter,
      orderBy: prismaSort,
      skip,
      take,
    });

    return {
      products,
      length: await this.prisma.product.count({
        where: prismaSearchTermFilter,
      }),
    };
  }

  async getById(id: number) {
    return await this.validator.validateProductExistence({ id });
  }

  async getBySlug(slug: string) {
    return await this.validator.validateProductExistence({ slug });
  }

  async getByCategory(categorySlug: string) {
    await this.validator.validateCategoryExistence({ slug: categorySlug });

    const products = this.prisma.product.findMany({
      where: {
        category: {
          slug: categorySlug,
        },
      },
      select: returnProductObject,
    });

    if (!products) {
      throw new NotFoundException('Product not found');
    }

    return products;
  }

  async getRelatedProducts(productId: number) {
    const product = await this.validator.validateProductExistence({
      id: productId,
    });

    const products = await this.prisma.product.findMany({
      where: {
        category: {
          name: product.category.name,
        },
        NOT: {
          id: productId,
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: returnProductObject,
    });

    return products;
  }

  async create(dto: ProductDto) {
    const { description, images, name, price, categoryId } = dto;

    await this.validator.validateProductUnique(name);

    return await this.prisma.product.create({
      data: {
        description,
        images,
        name,
        price,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async update(id: number, dto: ProductDto) {
    const { description, images, name, price, categoryId } = dto;

    return this.prisma.product.update({
      where: {
        id,
      },
      data: {
        description,
        images,
        name,
        price,
        slug: generateSlug(name),
        category: {
          connect: {
            id: categoryId,
          },
        },
      },
    });
  }

  async delete(productId: number) {
    await this.validator.validateProductExistence({ id: productId });

    return this.prisma.product.delete({
      where: {
        id: productId,
      },
    });
  }
}
