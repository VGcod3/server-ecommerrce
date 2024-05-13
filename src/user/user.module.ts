import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidatorService } from 'src/validator/validator.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, ValidatorService],
  exports: [UserService],
})
export class UserModule {}
