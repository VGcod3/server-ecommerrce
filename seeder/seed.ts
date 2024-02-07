import { faker } from '@faker-js/faker';
import { PrismaClient, Product } from '@prisma/client';
import * as dotenv from 'dotenv';
import { generateSlug } from '../src/utils/generate-slug';

dotenv.config();

const prisma = new PrismaClient();

const createProducts = async (quantity: number) => {
  const products: Product[] = [];

  for (let i = 0; i < quantity; i++) {
    const allProducts = await prisma.product.findMany({
      select: {
        name: true,
      },
    });
    const allCategories = await prisma.category.findMany({
      select: {
        name: true,
      },
    });

    let productName = faker.commerce.productName();
    while (allProducts.some((product) => product.name === productName)) {
      productName = faker.commerce.productName();
    }

    let categoryName = faker.commerce.department();
    while (allCategories.some((category) => category.name === categoryName)) {
      categoryName = faker.commerce.department();
    }

    const product = await prisma.product.create({
      data: {
        user: {
          connect: {
            id: 1,
          },
        },
        name: productName,
        slug: generateSlug(productName),
        price: +faker.commerce.price({ min: 10, max: 1000 }),
        description: faker.commerce.productDescription(),
        images: Array.from(
          { length: faker.number.int({ min: 3, max: 6 }) },
          () => faker.image.url(),
        ),
        category: {
          create: {
            name: categoryName,
            slug: generateSlug(categoryName),
          },
        },
        reviews: {
          create: [
            {
              rating: faker.number.float({ min: 1, max: 5, multipleOf: 0.5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1,
                },
              },
            },
            {
              rating: faker.number.float({ min: 1, max: 5, multipleOf: 0.5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1,
                },
              },
            },
            {
              rating: faker.number.float({ min: 1, max: 5, multipleOf: 0.5 }),
              text: faker.lorem.paragraph(),
              user: {
                connect: {
                  id: 1,
                },
              },
            },
          ],
        },
      },
    });
    console.log(`Created product ${product.name}`);

    products.push(product);
  }

  console.log(`Created ${quantity} products`);
};

async function main() {
  console.log('Seeding database...');
  await createProducts(10);
  console.log('Seeding complete');
}

main()
  .catch((e) => {
    console.error(e);
    // process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
