import { faker } from '@faker-js/faker';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { hash } from 'argon2';
import { capitalize } from 'src/utils/capitalize';
import { ValidatorService } from 'src/validator/validator.service';
import { PrismaService } from '../prisma/prisma.service';
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

    const tokens = this.generateTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async login(dto: AuthDto) {
    const user = await this.validator.validateCredentials(dto);

    const tokens = this.generateTokens(user.id);

    return {
      user: this.returnUserFields(user),
      ...tokens,
    };
  }

  async getNewTokens(refreshToken: string) {
    const result = await this.validateJwt(refreshToken);

    const user = await this.prisma.user.findUnique({
      where: {
        id: result.id,
      },
    });

    const tokens = this.generateTokens(user.id);

    return {
      user: this.returnUserFields(user),
      accessToken: tokens.accessToken,
    };
  }

  async validateJwt(token: string) {
    try {
      const result = this.jwt.verify(token);

      if (!result) {
        throw new UnauthorizedException(
          'Token verification failed: Invalid token!',
        );
      }

      return result;
    } catch (error) {
      // mostly token expired
      throw new UnauthorizedException(capitalize(error.message) + '!');
    }
  }

  private generateTokens(id: number) {
    const accessToken = this.jwt.sign(
      { id },
      {
        expiresIn: '20s',
      },
    );

    const refreshToken = this.jwt.sign(
      { id },
      {
        expiresIn: '30s',
      },
    );

    return { accessToken, refreshToken };
  }

  private returnUserFields(user: User) {
    return {
      id: user.id,
      email: user.email,
    };
  }
}
