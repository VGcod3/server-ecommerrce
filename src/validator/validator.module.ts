import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { ValidatorService } from './validator.service';

@Module({
  providers: [ValidatorService, PrismaService, JwtService],
  exports: [ValidatorService],
})
export class ValidatorModule {}
