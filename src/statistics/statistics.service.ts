import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class StatisticsService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async getMain(userId: number) {
    const user = await this.userService.byId(userId, {
      orders: {
        select: {
          items: true,
        },
      },
      reviews: true,
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const userSpending = await this.prisma.orderItem.aggregate({
      _sum: {
        price: true,
        quantity: true,
      },
      where: {
        orderId: {
          in: user.orders.map((order) => order.id),
        },
      },
    });

    // Calculate total amount spent
    const totalPrice = userSpending._sum?.price || 0;
    const totalQuantity = userSpending._sum?.quantity || 0;
    const totalAmount = totalPrice * totalQuantity;

    return [
      {
        name: 'Total Orders',
        value: user.orders.length,
      },
      {
        name: 'Review',
        value: user.reviews.length,
      },
      {
        name: 'Favorites',
        value: user.favorites.length,
      },
      {
        name: 'Total amount',
        value: totalAmount,
      },
    ];
  }
}
