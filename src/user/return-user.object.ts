import { Prisma } from '@prisma/client';
export const ReturnUser: Prisma.UserSelect = {
  id: true,
  email: true,
  name: true,
  avatarPath: true,
  password: false,
  phone: true,
};
