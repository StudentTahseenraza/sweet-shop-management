import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting enhanced database seed for MongoDB...');

  try {
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

    console.log('✅ Created admin user');

    // Create regular users
    const users = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'User123!',
        role: 'CUSTOMER',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        password: 'User123!',
        role: 'CUSTOMER',
      },
      {
        name: 'Bob Wilson',
        email: 'bob.wilson@example.com',
        password: 'User123!',
        role: 'CUSTOMER',
      },
      {
        name: 'Alice Johnson',
        email: 'alice.johnson@example.com',
        password: 'User123!',
        role: 'CUSTOMER',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        password: 'User123!',
        role: 'CUSTOMER',
      },
    ];

    for (const userData of users) {
      const password = await bcrypt.hash(userData.password, 10);
      await prisma.user.create({
        data: {
          email: userData.email,
          password: password,
          name: userData.name,
          role: userData.role,
        },
      });
    }

    console.log(`👥 Created ${users.length} regular users`);

    // Create sweets with diverse categories and high-quality images
    const sweetsData = [
      // Chocolate Category (Premium)
      {
        name: 'Belgian Dark Chocolate Truffles',
        description: 'Artisanal dark chocolate truffles from Belgium, filled with silky ganache and dusted with cocoa powder. Perfect for chocolate connoisseurs.',
        category: 'Chocolate',
        price: 24.99,
        quantity: 85,
        imageUrl: 'https://images.unsplash.com/photo-1623334044303-241021148842?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Swiss Milk Chocolate Bar',
        description: 'Premium Swiss milk chocolate with toasted almonds and a hint of sea salt. Creamy texture with perfect sweetness balance.',
        category: 'Chocolate',
        price: 18.50,
        quantity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'White Chocolate Raspberry Hearts',
        description: 'Luxurious white chocolate hearts filled with tangy raspberry compote. Elegant packaging makes them perfect for gifts.',
        category: 'Chocolate',
        price: 22.75,
        quantity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1603532648955-039310d9ed75?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Chocolate Caramel Sea Salt Squares',
        description: 'Decadent squares of chocolate-covered caramel with flaky sea salt. The perfect balance of sweet and salty.',
        category: 'Chocolate',
        price: 19.99,
        quantity: 95,
        imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4c652a52?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Cake Category (Specialty)
      {
        name: 'Triple Chocolate Fudge Cake',
        description: 'Three layers of rich chocolate cake with chocolate mousse filling and dark chocolate ganache frosting. A chocolate lovers dream.',
        category: 'Cake',
        price: 45.99,
        quantity: 12,
        imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Red Velvet Cheesecake',
        description: 'Moist red velvet cake layered with creamy New York-style cheesecake, topped with cream cheese frosting.',
        category: 'Cake',
        price: 42.50,
        quantity: 15,
        imageUrl: 'https://images.unsplash.com/photo-1614707267537-b85aaf00c4b7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'French Lemon Tart',
        description: 'Classic French lemon tart with buttery shortcrust pastry and tangy lemon curd filling. Garnished with fresh berries.',
        category: 'Cake',
        price: 38.75,
        quantity: 20,
        imageUrl: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Pastry Category (French)
      {
        name: 'Butter Croissants (6-pack)',
        description: 'Authentic French butter croissants with 27 layers of flaky pastry. Baked fresh daily using traditional techniques.',
        category: 'Pastry',
        price: 16.99,
        quantity: 150,
        imageUrl: 'https://images.unsplash.com/photo-1555507036-ab794f27d2e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pain au Chocolat',
        description: 'Classic French pastry with two bars of dark chocolate wrapped in buttery, flaky croissant dough.',
        category: 'Pastry',
        price: 4.50,
        quantity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1541783245831-57d6fb0926d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Apple Cinnamon Danish',
        description: 'Flaky Danish pastry filled with spiced apple compote and topped with cinnamon streusel and vanilla glaze.',
        category: 'Pastry',
        price: 5.25,
        quantity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Cookie Category (Gourmet)
      {
        name: 'Double Chocolate Chunk Cookies',
        description: 'Gourmet cookies with 70% dark chocolate chunks and a sprinkle of sea salt. Crispy edges with a soft, chewy center.',
        category: 'Cookie',
        price: 3.99,
        quantity: 300,
        imageUrl: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Salted Caramel Macadamia Cookies',
        description: 'Buttery cookies filled with salted caramel chunks and roasted macadamia nuts. Irresistibly decadent.',
        category: 'Cookie',
        price: 4.25,
        quantity: 180,
        imageUrl: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Matcha White Chocolate Cookies',
        description: 'Premium Japanese matcha green tea cookies with white chocolate chunks. Elegant and sophisticated flavor profile.',
        category: 'Cookie',
        price: 4.75,
        quantity: 160,
        imageUrl: 'https://images.unsplash.com/photo-1550617931-e17a7b70dce2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Cupcake Category (Artisanal)
      {
        name: 'Salted Caramel Cupcakes',
        description: 'Moist caramel cupcakes filled with salted caramel sauce, topped with caramel buttercream and gold leaf.',
        category: 'Cupcake',
        price: 5.50,
        quantity: 90,
        imageUrl: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Raspberry Rose Cupcakes',
        description: 'Delicate rose-infused cupcakes with raspberry filling, topped with rose buttercream and fresh rose petals.',
        category: 'Cupcake',
        price: 5.75,
        quantity: 75,
        imageUrl: 'https://images.unsplash.com/photo-1587658666641-ba0a8cdd90b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Cookies & Cream Cupcakes',
        description: 'Chocolate cupcakes filled with cookie cream, topped with cookies & cream buttercream and chocolate cookie crumbs.',
        category: 'Cupcake',
        price: 5.25,
        quantity: 110,
        imageUrl: 'https://images.unsplash.com/photo-1557925923-cd4648e211a0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Donut Category (Specialty)
      {
        name: 'Maple Bacon Donuts',
        description: 'Fluffy yeast donuts glazed with real maple syrup and topped with crispy bacon pieces. Sweet and savory perfection.',
        category: 'Donut',
        price: 4.99,
        quantity: 130,
        imageUrl: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Matcha Green Tea Donuts',
        description: 'Japanese matcha-infused donuts with matcha glaze and white chocolate drizzle. Elegant and refreshing.',
        category: 'Donut',
        price: 4.75,
        quantity: 95,
        imageUrl: 'https://images.unsplash.com/photo-1551106652-a5bcf4b29ab6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Red Velvet Donuts',
        description: 'Moist red velvet donuts with cream cheese glaze and red velvet cake crumbs. Festive and delicious.',
        category: 'Donut',
        price: 4.50,
        quantity: 120,
        imageUrl: 'https://images.unsplash.com/photo-1533910534207-90f31029a78e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Macaron Category (French)
      {
        name: 'French Macaron Assortment (12 pieces)',
        description: 'Assortment of 12 French macarons in various flavors: pistachio, raspberry, salted caramel, chocolate, vanilla, and rose.',
        category: 'Macaron',
        price: 29.99,
        quantity: 60,
        imageUrl: 'https://images.unsplash.com/photo-1569929238190-869826b1bb05?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Pistachio Rose Macarons',
        description: 'Delicate French macarons with pistachio filling and a hint of rose water. Elegant and sophisticated.',
        category: 'Macaron',
        price: 3.25,
        quantity: 200,
        imageUrl: 'https://images.unsplash.com/photo-1568702846914-96b305d2aaeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Candy Category (Gourmet)
      {
        name: 'Artisanal Saltwater Taffy',
        description: 'Hand-pulled saltwater taffy in 12 different flavors. Made with real fruit extracts and natural colors.',
        category: 'Candy',
        price: 12.99,
        quantity: 180,
        imageUrl: 'https://images.unsplash.com/photo-1575224300306-1b8da36134ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Gourmet Chocolate-covered Pretzels',
        description: 'Thin pretzel rods covered in premium dark chocolate and sprinkled with sea salt. Sweet and salty perfection.',
        category: 'Candy',
        price: 14.50,
        quantity: 140,
        imageUrl: 'https://images.unsplash.com/photo-1576671414121-afb6f7b9e4f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Brownie Category (Premium)
      {
        name: 'Salted Caramel Brownie Bites',
        description: 'Fudgy brownie squares with gooey salted caramel center, topped with sea salt flakes. Indulgent and delicious.',
        category: 'Brownie',
        price: 3.99,
        quantity: 220,
        imageUrl: 'https://images.unsplash.com/photo-1605190557072-1f989f53c2d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Raspberry Cheesecake Brownies',
        description: 'Rich chocolate brownie layer topped with creamy cheesecake and swirled with raspberry compote.',
        category: 'Brownie',
        price: 4.25,
        quantity: 160,
        imageUrl: 'https://images.unsplash.com/photo-1624353365286-3f8d62dadadf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Pie Category (Seasonal)
      {
        name: 'Dutch Apple Pie',
        description: 'Classic apple pie with cinnamon-spiced apple filling and buttery crumb topping. Served with vanilla bean ice cream.',
        category: 'Pie',
        price: 32.99,
        quantity: 25,
        imageUrl: 'https://images.unsplash.com/photo-1562007908-859b4ba9a1a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Southern Pecan Pie',
        description: 'Rich pecan pie with buttery crust, gooey filling, and topped with whole pecans. A Southern classic.',
        category: 'Pie',
        price: 34.50,
        quantity: 18,
        imageUrl: 'https://images.unsplash.com/photo-1540148426945-6cf22c6b3a2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },

      // Gelato Category (Italian)
      {
        name: 'Italian Gelato Trio',
        description: 'Three scoops of authentic Italian gelato in flavors: pistachio, stracciatella, and hazelnut. Creamy and smooth.',
        category: 'Gelato',
        price: 8.99,
        quantity: 50,
        imageUrl: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
      {
        name: 'Sorbet Selection',
        description: 'Refreshing fruit sorbets: mango, raspberry, and lemon. Dairy-free and bursting with natural fruit flavors.',
        category: 'Gelato',
        price: 7.50,
        quantity: 65,
        imageUrl: 'https://images.unsplash.com/photo-1570196917859-56ed24c7ea7e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      },
    ];

    const sweets = await prisma.sweet.createMany({
      data: sweetsData,
    });

    console.log(`🍬 Created ${sweets.count} sweets across 10 categories`);

    // Get created users and sweets for purchases
    const allUsers = await prisma.user.findMany();
    const allSweets = await prisma.sweet.findMany();

    // Create sample purchases for multiple users
    if (allUsers.length > 0 && allSweets.length > 0) {
      const purchases = [
        // John Doe's purchases
        {
          sweetId: allSweets[0].id, // Belgian Dark Chocolate Truffles
          userId: allUsers[1].id,
          quantity: 2,
          totalPrice: 24.99 * 2,
        },
        {
          sweetId: allSweets[10].id, // Double Chocolate Chunk Cookies
          userId: allUsers[1].id,
          quantity: 3,
          totalPrice: 3.99 * 3,
        },
        // Jane Smith's purchases
        {
          sweetId: allSweets[5].id, // Triple Chocolate Fudge Cake
          userId: allUsers[2].id,
          quantity: 1,
          totalPrice: 45.99,
        },
        {
          sweetId: allSweets[15].id, // French Macaron Assortment
          userId: allUsers[2].id,
          quantity: 1,
          totalPrice: 29.99,
        },
        // Bob Wilson's purchases
        {
          sweetId: allSweets[3].id, // Chocolate Caramel Sea Salt Squares
          userId: allUsers[3].id,
          quantity: 5,
          totalPrice: 19.99 * 5,
        },
        {
          sweetId: allSweets[8].id, // Apple Cinnamon Danish
          userId: allUsers[3].id,
          quantity: 6,
          totalPrice: 5.25 * 6,
        },
        // Alice Johnson's purchases
        {
          sweetId: allSweets[12].id, // Raspberry Rose Cupcakes
          userId: allUsers[4].id,
          quantity: 4,
          totalPrice: 5.75 * 4,
        },
        {
          sweetId: allSweets[18].id, // Dutch Apple Pie
          userId: allUsers[4].id,
          quantity: 1,
          totalPrice: 32.99,
        },
      ];

      await prisma.purchase.createMany({
        data: purchases,
      });

      console.log('🛒 Created sample purchases for all users');
      
      // Update sweet quantities based on purchases
      for (const purchase of purchases) {
        const sweet = allSweets.find(s => s.id === purchase.sweetId);
        if (sweet) {
          await prisma.sweet.update({
            where: { id: sweet.id },
            data: { quantity: sweet.quantity - purchase.quantity },
          });
        }
      }
    }

    // Get category statistics
    const categories = [...new Set(sweetsData.map(sweet => sweet.category))];
    
    console.log('\n✅ Database seeding completed!');
    console.log('📊 ========== STATISTICS ==========');
    console.log(`👥 Total Users: ${await prisma.user.count()} (1 Admin, ${users.length} Customers)`);
    console.log(`🍬 Total Sweets: ${sweets.count}`);
    console.log(`🏷️  Categories: ${categories.length}`);
    console.log('   ' + categories.join(', '));
    console.log(`💰 Total Inventory Value: $${sweetsData.reduce((sum, sweet) => sum + (sweet.price * sweet.quantity), 0).toFixed(2)}`);
    console.log(`🛒 Total Purchases: ${await prisma.purchase.count()}`);
    console.log('📊 =================================');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();