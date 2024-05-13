import { Prisma } from '@prisma/client';
import { ReturnUserObject } from 'src/user/return-user.object';

export const returnReviewObject: Prisma.ReviewSelect = {
  user: {
    select: ReturnUserObject,
  },
  createdAt: true,
  text: true,
  rating: true,
  id: true,
};
