import { Controller, Get } from '@nestjs/common';
import { Auth } from 'src/auth/auth.decorator';
import { CurrentUser } from 'src/auth/user.decorator';
import { OrderService } from './order.service';

@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: number) {
    return await this.orderService.getAll(userId);
  }
}
