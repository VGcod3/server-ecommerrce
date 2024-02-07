import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';
import { returnReviewObject } from './return-review';
import { ReviewDto } from './review.dto';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly validator: ValidatorService,
  ) {}

  async getAll() {
    return await this.prisma.review.findMany({
      orderBy: { createdAt: 'desc' },
      select: returnReviewObject,
    });
  }

  async byId(id: number) {
    return await this.validator.validateReviewExistence(id);
  }

  async create(productId: number, dto: ReviewDto, userId: number) {
    await this.validator.validateProductExistence({ id: productId });
    await this.validator.validateUserExistence(userId);

    return await this.prisma.review.create({
      data: {
        ...dto,
        product: { connect: { id: productId } },
        user: { connect: { id: userId } },
      },
    });
  }

  async update(id: number, dto: ReviewDto, userId: number) {
    await this.validator.validateReviewExistence(id);
    await this.validator.validateUserExistence(userId);

    const review = await this.byId(id);

    await this.validator.ensureReviewOwnership(review.id, userId);

    return await this.prisma.review.update({
      where: { id },
      data: dto,
    });
  }

  async delete(reviewId: number, userId: number) {
    const review = await this.validator.validateReviewExistence(reviewId);

    await this.validator.ensureReviewOwnership(review.user.id, userId);

    return await this.prisma.review.delete({
      where: { id: reviewId },
    });
  }

  async getAverageRating(productId: number) {
    await this.validator.validateProductExistence({ id: productId });

    const avgRating = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });

    return avgRating._avg;
  }
}
