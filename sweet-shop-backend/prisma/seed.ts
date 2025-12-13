import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  // Create regular user
  const userPassword = await bcrypt.hash('User123!', 10);
  const user = await prisma.user.create({
    data: {
      email: 'user@sweetshop.com',
      password: userPassword,
      name: 'Regular User',
      role: 'CUSTOMER',
    },
  });

  console.log('👥 Created users');

  // Create sweets
  const sweets = await prisma.sweet.createMany({
    data: [
      {
        name: 'Chocolate Truffle',
        description: 'Rich dark chocolate truffle with cocoa powder',
        category: 'Chocolate',
        price: 2.99,
        quantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842',
      },
      {
        name: 'Strawberry Cheesecake',
        description: 'Creamy cheesecake with fresh strawberry topping',
        category: 'Cake',
        price: 4.99,
        quantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf',
      },
      {
        name: 'Vanilla Cupcake',
        description: 'Soft vanilla cupcake with buttercream frosting',
        category: 'Cupcake',
        price: 3.49,
        quantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
      },
      {
        name: 'Lemon Tart',
        description: 'Tangy lemon filling in a buttery crust',
        category: 'Tart',
        price: 3.99,
        quantity: 30,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7',
      },
      {
        name: 'Macarons Assortment',
        description: 'Assorted French macarons in various flavors',
        category: 'Macaron',
        price: 12.99,
        quantity: 40,
        imageUrl: 'https://images.unsplash.com/photo-1569929238190-869826b1bb05',
      },
      {
        name: 'Red Velvet Cake',
        description: 'Moist red velvet cake with cream cheese frosting',
        category: 'Cake',
        price: 29.99,
        quantity: 10,
        imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
      },
      {
        name: 'Caramel Brownie',
        description: 'Fudgy brownie with caramel swirls',
        category: 'Brownie',
        price: 2.49,
        quantity: 75,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf',
      },
      {
        name: 'Fruit Tart',
        description: 'Fresh fruit tart with pastry cream',
        category: 'Tart',
        price: 4.49,
        quantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
      },
      {
        name: 'Chocolate Chip Cookies',
        description: 'Classic cookies with chocolate chips',
        category: 'Cookie',
        price: 1.99,
        quantity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
      },
      {
        name: 'Rainbow Donut',
        description: 'Colorful donut with sprinkles',
        category: 'Donut',
        price: 2.99,
        quantity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
      },
    ],
  });

  console.log(`🍬 Created ${sweets.count} sweets`);

  // Create some sample purchases
  const chocolateTruffle = await prisma.sweet.findFirst({
    where: { name: 'Chocolate Truffle' },
  });

  const vanillaCupcake = await prisma.sweet.findFirst({
    where: { name: 'Vanilla Cupcake' },
  });

  if (chocolateTruffle && vanillaCupcake) {
    await prisma.purchase.createMany({
      data: [
        {
          sweetId: chocolateTruffle.id,
          userId: user.id,
          quantity: 2,
          totalPrice: 2.99 * 2,
        },
        {
          sweetId: vanillaCupcake.id,
          userId: user.id,
          quantity: 3,
          totalPrice: 3.49 * 3,
        },
      ],
    });

    // Update quantities
    await prisma.sweet.update({
      where: { id: chocolateTruffle.id },
      data: { quantity: chocolateTruffle.quantity - 2 },
    });

    await prisma.sweet.update({
      where: { id: vanillaCupcake.id },
      data: { quantity: vanillaCupcake.quantity - 3 },
    });

    console.log('🛒 Created sample purchases');
  }

  console.log('✅ Database seeding completed!');
  console.log('🔑 Admin credentials:');
  console.log(`   Email: ${admin.email}`);
  console.log(`   Password: ${process.env.ADMIN_PASSWORD || 'Admin123!'}`);
  console.log('👤 User credentials:');
  console.log(`   Email: ${user.email}`);
  console.log(`   Password: User123!`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });