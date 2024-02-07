import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ValidatorService } from './validator.service';

@Module({
  providers: [ValidatorService, PrismaService],
  exports: [ValidatorService],
})
export class ValidatorModule {}
