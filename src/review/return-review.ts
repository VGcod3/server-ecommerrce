import { Prisma } from '@prisma/client';
import { ReturnUser } from 'src/user/return-user.object';

export const returnReviewObject: Prisma.ReviewSelect = {
  user: {
    select: ReturnUser,
  },
  createdAt: true,
  text: true,
  rating: true,
  id: true,
};
