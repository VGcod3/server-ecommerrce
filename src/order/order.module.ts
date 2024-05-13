import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService, PrismaService, ValidatorService],
})
export class OrderModule {}
