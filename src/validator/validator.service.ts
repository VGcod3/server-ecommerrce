import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { verify } from 'argon2';
import { AuthDto } from 'src/auth/auth.dto';
import { returnCategoryObject } from 'src/category/return-category';
import { PrismaService } from 'src/prisma.service';
import { returnProductObject } from 'src/product/return-product';
import { returnReviewObject } from 'src/review/return-review';
import { ReturnUser } from 'src/user/return-user.object';

@Injectable()
export class ValidatorService {
  constructor(private readonly prisma: PrismaService) {}

  async validateReviewExistence(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      select: returnReviewObject,
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async validateProductExistence(where: Prisma.ProductWhereUniqueInput) {
    const product = await this.prisma.product.findUnique({
      where,
      select: returnProductObject,
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async validateUserExistence(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: ReturnUser,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async validateUser(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await verify(user.password, dto.password);

    if (!isValid) {
      throw new UnauthorizedException('Invalid password');
    }

    return user;
  }

  async validateCategoryExistence(where: Prisma.CategoryWhereUniqueInput) {
    const category = await this.prisma.category.findUnique({
      where,
      select: returnCategoryObject,
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async validateOrderExistence(id: number) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async validateOrderItemExistence(id: number) {
    const orderItem = await this.prisma.orderItem.findUnique({
      where: { id },
    });
    if (!orderItem) {
      throw new NotFoundException('Order item not found');
    }

    return orderItem;
  }

  async validateEmailUnique(email: string) {
    const userWithSameEmail = await this.prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (userWithSameEmail) {
      throw new BadRequestException('User with this email already exists');
    }
  }

  async validateProductUnique(name: string) {
    const productWithSameName = await this.prisma.product.findFirst({
      where: {
        name: name,
      },
    });

    if (productWithSameName) {
      throw new BadRequestException('Product with this name already exists');
    }
  }

  async validateCategoryUnique(name: string) {
    const categoryWithSameName = await this.prisma.category.findFirst({
      where: {
        name: name,
      },
    });

    if (categoryWithSameName) {
      throw new BadRequestException('Category with this name already exists');
    }
  }

  async validateOrderItemUnique(productId: number, orderId: number) {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        productId: productId,
        orderId: orderId,
      },
    });

    if (orderItem) {
      throw new BadRequestException('Order item already exists');
    }
  }

  async ensureReviewOwnership(reviewId: number, userId: number) {
    if (reviewId !== userId) {
      throw new BadRequestException('You do not own this comment');
    }
  }

  async ensureOrderOwnership(orderId: number, userId: number) {
    const order = await this.prisma.order.findFirst({
      where: {
        id: orderId,
        userId: userId,
      },
    });

    if (!order) {
      throw new BadRequestException('You do not own this order');
    }
  }

  async ensureOrderItemOwnership(orderItemId: number, userId: number) {
    const orderItem = await this.prisma.orderItem.findFirst({
      where: {
        id: orderItemId,
        order: {
          userId: userId,
        },
      },
    });

    if (!orderItem) {
      throw new BadRequestException('You do not own this order item');
    }
  }

  async ensureProductOwnership(productId: number, userId: number) {
    const product = await this.prisma.product.findFirst({
      where: {
        id: productId,
        userId: userId,
      },
    });

    if (!product) {
      throw new BadRequestException('You do not own this product');
    }
  }
}
