import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReturnUserObject } from './return-user.object';

import { hash } from 'argon2';
import { ValidatorService } from 'src/validator/validator.service';
import { UserDto } from './user.dto';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private validator: ValidatorService,
  ) {}

  async byId(userId: number, selectObject: Prisma.UserSelect = {}) {
    await this.validator.validateUserExistence(userId);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        ...ReturnUserObject,
        ...selectObject,
        favorites: {
          select: {
            id: true,
            name: true,
            price: true,
            slug: true,
            images: true,
          },
        },
      },
    });

    return user;
  }

  async updateProfile(id: number, dto: UserDto) {
    await this.validator.validateEmailUnique(dto.email);
    await this.validator.validateUserExistence(id);

    const user = await this.byId(id);

    return this.prisma.user.update({
      where: { id },
      data: {
        email: dto.email,
        name: dto.name,
        avatarPath: dto.avatarPath,
        phone: dto.phone,
        password: dto.password ? await hash(dto.password) : user.password,
      },
    });
  }

  async toggleFavorite(userId: number, productId: number) {
    await this.validator.validateProductExistence({ id: productId });
    await this.validator.validateUserExistence(userId);

    const user = await this.byId(userId);

    const ifExists = user.favorites.some((product) => product.id === productId);

    await this.prisma.user.update({
      where: { id: userId },
      data: {
        favorites: {
          [ifExists ? 'disconnect' : 'connect']: {
            id: +productId,
          },
        },
      },
    });

    return user.favorites;
  }

  async deleteProfile(userId: number) {
    await this.validator.validateUserExistence(userId);

    return this.prisma.user.delete({
      where: { id: userId },
    });
  }
}
