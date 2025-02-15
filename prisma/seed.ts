import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.products.createMany({
    data: [
      { id: 1, productName: 'HP laptop', productDescription: 'This is HP laptop' },
      { id: 2, productName: 'lenovo laptop', productDescription: 'This is lenovo' },
      { id: 3, productName: 'Car', productDescription: 'This is Car' },
      { id: 4, productName: 'Bike', productDescription: 'This is Bike' },
    ],
  });
  console.log('Inserted product records');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
