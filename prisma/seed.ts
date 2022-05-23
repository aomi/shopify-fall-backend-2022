// prisma/seed.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // create sample t-shirt
  prisma.inventory.create({
    data: {
      name: "Cool T-Shirt",
      description: "A cool t-shirt",
      price: 1000,
      quantity: 1,
      image: "https://some-url.com/cool-t-shirt.jpg",
    },
  });
  // sample jeans
  await prisma.inventory.create({
    data: {
      name: "Cool Jeans",
      description: "Some cool jeans",
      price: 5000,
      quantity: 1,
      image: "https://some-url.com/cool-jeans.jpg",
    },
  });
  // sample socks
  const socks = await prisma.inventory.create({
    data: {
      name: "Cool Socks",
      description: "A cool pair of socks",
      price: 500,
      quantity: 1,
      image: "https://some-url.com/cool-socks.jpg",
    },
  });
  // delete sock inventory
  await prisma.$transaction([
    prisma.inventory.update({
      where: {
        id: socks.id,
      },
      data: {
        deletedAt: new Date(),
      },
    }),
    prisma.inventoryMetadata.create({
      data: {
        type: "deletion",
        comment: "Deleted by user",
        inventoryId: socks.id,
      },
    }),
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
