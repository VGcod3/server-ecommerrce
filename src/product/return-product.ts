import { Prisma } from '@prisma/client';
import { returnCategoryObject } from './../category/return-category';
import { returnReviewObject } from './../review/return-review';

export const returnProductObject: Prisma.ProductSelect = {
  images: true,
  description: true,
  id: true,
  name: true,
  price: true,
  slug: true,
  createdAt: true,
  updatedAt: true,
};

export const productReturnObjectFull: Prisma.ProductSelect = {
  ...returnProductObject,
  reviews: {
    select: returnReviewObject,
  },
  category: {
    select: returnCategoryObject,
  },
};
