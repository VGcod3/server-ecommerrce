import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Review } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { returnReviewObject } from './return-review';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(private readonly prisma: PrismaService) {}

  async getAll() {
    return await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: returnReviewObject,
    });
  }

  async byId(id: number) {
    return await this.getReviewOrThrow(id);
  }

  async create(productId: number, dto: ReviewDto, userId: number) {
    await this.validateProduct(productId);
    await this.validateUser(userId);

    return await this.prisma.review.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: number, dto: ReviewDto, userId: number) {
    const review = await this.getReviewOrThrow(id);
    this.ensureOwnership(review, userId);

    return await this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async delete(id: number, userId: number) {
    const review = await this.getReviewOrThrow(id);
    this.ensureOwnership(review, userId);

    return await this.prisma.review.delete({
      where: { id },
    });
  }

  async getAverageRating(productId: number) {
    await this.validateProduct(productId);

    const avgRating = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    return avgRating._avg;
  }

  private async getReviewOrThrow(id: number) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });
    if (!review) {
      throw new NotFoundException('Review not found');
    }
    return review;
  }

  private async validateProduct(productId: number) {
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
  }

  private async validateUser(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
  }

  private ensureOwnership(review: Review, userId: number) {
    if (review.userId !== userId) {
      throw new ForbiddenException(
        'You are not authorized to perform this action',
      );
    }
  }
}
