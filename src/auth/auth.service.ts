import { faker } from '@faker-js/faker';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { ValidatorService } from 'src/validator/validator.service';
import { PrismaService } from '../prisma.service';
import { AuthDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private jwt: JwtService,
    private validator: ValidatorService,
  ) {}

  async register(dto: AuthDto) {
    await this.validator.validateEmailUnique(dto.email);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        name: faker.person.firstName(),
        avatarPath: faker.image.avatar(),
        phone: faker.phone.number('+380 (##) ###-##-##'),
        password: await hash(dto.password),
      },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validator.validateUser(dto);

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.jwt.verifyAsync(refreshToken);

    if (!result) {
      throw new UnauthorizedException('Invalid token');
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = await this.issueTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  private async issueTokens(userId: number) {
    const data = {
      id: userId,
    };

    const accessToken = this.jwt.sign(data, {
      expiresIn: '1h',
    });

    const refreshToken = this.jwt.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
