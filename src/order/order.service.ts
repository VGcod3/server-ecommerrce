import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService,
    private validator: ValidatorService,
  ) {}
  async getAll(userId: number) {
    await this.validator.validateUserExistence(userId);

    return await this.prisma.order.findMany({
      where: {
        userId,
      },
    });
  }
}
