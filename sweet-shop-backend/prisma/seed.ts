import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
});

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.restock.deleteMany();
  await prisma.purchase.deleteMany();
  await prisma.sweet.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 10);
  const admin = await prisma.user.create({
    data: {
      email: process.env.ADMIN_EMAIL || 'admin@sweetshop.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

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

  const sweets = await prisma.sweet.createMany({
    data: [
      {
        name: 'Dark Chocolate Truffle',
        description: 'Premium dark chocolate truffle with cocoa dust',
        category: 'Chocolate',
        price: 3.50,
        quantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842',
      },
      {
        name: 'Milk Chocolate Bar',
        description: 'Smooth milk chocolate bar with almonds',
        category: 'Chocolate',
        price: 4.25,
        quantity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52',
      },
      {
        name: 'White Chocolate Hearts',
        description: 'Sweet white chocolate in heart shapes',
        category: 'Chocolate',
        price: 2.99,
        quantity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75',
      },
      {
        name: 'Chocolate Fudge Cake',
        description: 'Rich chocolate fudge cake with ganache',
        category: 'Cake',
        price: 35.99,
        quantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587',
      },
      {
        name: 'Carrot Cake',
        description: 'Moist carrot cake with cream cheese frosting',
        category: 'Cake',
        price: 28.50,
        quantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1596223575327-99a5be4faf1b',
      },
      {
        name: 'Cheesecake',
        description: 'New York style cheesecake with berry compote',
        category: 'Cake',
        price: 32.99,
        quantity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
      },
      {
        name: 'Double Chocolate Cookies',
        description: 'Soft cookies with double chocolate chips',
        category: 'Cookie',
        price: 1.99,
        quantity: 300,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e',
      },
      {
        name: 'Oatmeal Raisin Cookies',
        description: 'Healthy oatmeal cookies with raisins',
        category: 'Cookie',
        price: 1.75,
        quantity: 250,
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35',
      },
      {
        name: 'Red Velvet Cupcake',
        description: 'Moist red velvet cupcake with cream cheese',
        category: 'Cupcake',
        price: 4.50,
        quantity: 80,
        imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7',
      },
      {
        name: 'Chocolate Cupcake',
        description: 'Chocolate cupcake with chocolate frosting',
        category: 'Cupcake',
        price: 3.99,
        quantity: 90,
        imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd',
      },
      {
        name: 'Glazed Donut',
        description: 'Classic glazed donut',
        category: 'Donut',
        price: 2.50,
        quantity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307',
      },
      {
        name: 'Chocolate Donut',
        description: 'Chocolate frosted donut with sprinkles',
        category: 'Donut',
        price: 2.75,
        quantity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6',
      },
      {
        name: 'Croissant',
        description: 'Buttery French croissant',
        category: 'Pastry',
        price: 3.50,
        quantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9',
      },
      {
        name: 'Pain au Chocolat',
        description: 'Chocolate filled pastry',
        category: 'Pastry',
        price: 4.25,
        quantity: 80,
        imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3',
      },
      {
        name: 'Gummy Bears',
        description: 'Assorted fruit flavored gummy bears',
        category: 'Candy',
        price: 5.99,
        quantity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec',
      },
      {
        name: 'Hard Candies',
        description: 'Assorted hard candies in various flavors',
        category: 'Candy',
        price: 4.50,
        quantity: 180,
        imageUrl: 'https://images.unsplash.com/photo-1514517260015-2f1f338b5b8c',
      },
      {
        name: 'Walnut Brownie',
        description: 'Fudgy brownie with walnut pieces',
        category: 'Brownie',
        price: 3.25,
        quantity: 110,
        imageUrl: 'https://images.unsplash.com/photo-1605190557072-1f989f53c2d5',
      },
      {
        name: 'Blondie',
        description: 'White chocolate brownie',
        category: 'Brownie',
        price: 3.10,
        quantity: 100,
        imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842',
      },
      {
        name: 'Berry Tart',
        description: 'Mixed berry tart with custard',
        category: 'Tart',
        price: 5.50,
        quantity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187',
      },
      {
        name: 'Chocolate Tart',
        description: 'Rich chocolate ganache tart',
        category: 'Tart',
        price: 5.75,
        quantity: 55,
        imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e',
      },
      {
        name: 'Apple Pie',
        description: 'Classic apple pie with cinnamon',
        category: 'Pie',
        price: 24.99,
        quantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2',
      },
      {
        name: 'Pumpkin Pie',
        description: 'Seasonal pumpkin pie with spices',
        category: 'Pie',
        price: 22.50,
        quantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3',
      },
    ],
  });

  console.log(`🍬 Created ${sweets.count} sweets`);

  const chocolateTruffle = await prisma.sweet.findFirst({
    where: { name: 'Dark Chocolate Truffle' },
  });

  const vanillaCupcake = await prisma.sweet.findFirst({
    where: { name: 'Chocolate Cupcake' },
  });

  if (chocolateTruffle && vanillaCupcake) {
    await prisma.purchase.createMany({
      data: [
        {
          sweetId: chocolateTruffle.id,
          userId: user.id,
          quantity: 5,
          totalPrice: 3.50 * 5,
        },
        {
          sweetId: vanillaCupcake.id,
          userId: user.id,
          quantity: 3,
          totalPrice: 3.99 * 3,
        },
        {
          sweetId: chocolateTruffle.id,
          userId: admin.id,
          quantity: 10,
          totalPrice: 3.50 * 10,
        },
      ],
    });

    await prisma.sweet.update({
      where: { id: chocolateTruffle.id },
      data: { quantity: chocolateTruffle.quantity - 15 },
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
  console.log('\n📊 Statistics:');
  console.log(`   Total Sweets: ${sweets.count}`);
  console.log(`   Categories: 10 categories`);
}

main()
  .catch((error) => {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });