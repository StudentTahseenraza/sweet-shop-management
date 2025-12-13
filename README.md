🍬 Sweet Shop Management System
---------------------------------------------------------------------------------------------------------------

A full-stack e-commerce platform for managing a sweet shop with admin dashboard, user management, inventory control, and online ordering system.
---------------------------------------------------------------------------------------------------------------
✨ Features
🛒 Customer Features
User Authentication - Register/Login with JWT

Browse Sweets - View all available sweets with high-quality images

Search & Filter - Search by name, filter by category, price range, stock status

Product Details - View detailed product information

Shopping Cart - Add sweets to cart

Purchase History - Track previous orders

User Profile - Manage account information

---------------------------------------------------------------------------------------------------------------

👑 Admin Features
Admin Dashboard - Overview with statistics and charts

Sweet Management - CRUD operations for sweets (Create, Read, Update, Delete)

Inventory Management - Track stock levels, low stock alerts

User Management - View all users, manage roles

Order Management - View and manage customer orders

Analytics - Sales charts, category distribution

Bulk Actions - Import/Export inventory

---------------------------------------------------------------------------------------------------------------

🏗️ Tech Stack
Frontend
React with TypeScript

Tailwind CSS for styling

React Router for navigation

React Hook Form + Zod for form validation

Context API for state management

React Hot Toast for notifications

Chart.js for analytics

Backend
Node.js with Express

TypeScript for type safety

Prisma ORM with MongoDB

JWT for authentication

bcryptjs for password hashing

Zod for validation

CORS, Helmet, Morgan for security and logging

Database
MongoDB Atlas (Cloud Database)

Prisma as ORM

---------------------------------------------------------------------------------------------------------------

📋 Prerequisites
Before you begin, ensure you have installed:

Node.js (v16 or higher)

npm or yarn

Git

MongoDB Atlas Account (Free tier)
---------------------------------------------------------------------------------------------------------------

🚀 Quick Start

    1. Clone the Repository
    bash
    git clone https://github.com/yourusername/sweet-shop-management.git
    cd sweet-shop-management
    2. Backend Setup
    bash
    # Navigate to backend directory
    cd sweet-shop-backend
    
    # Install dependencies
    npm install
    
    # Set up environment variables
    cp .env.example .env
    3. Configure Environment Variables
    Edit the .env file in sweet-shop-backend:
    
    env
    # MongoDB Atlas Connection String
    # Get this from your MongoDB Atlas dashboard
    DATABASE_URL="mongodb+srv://yourusername:yourpassword@cluster0.mongodb.net/sweetshop?retryWrites=true&w=majority"

    # Server Configuration
    PORT=5000
    NODE_ENV=development
    
    # JWT Configuration
    JWT_SECRET=your-super-secret-jwt-key-change-in-production
    JWT_EXPIRES_IN="24h"
    
    # Admin Credentials
    ADMIN_EMAIL="admin@sweetshop.com"
    ADMIN_PASSWORD="Admin123!"

---------------------------------------------------------------------------------------------------------------

4. Set Up MongoDB Atlas
Create a MongoDB Atlas Account at mongodb.com/cloud/atlas

Create a Free Cluster (M0 tier - 512MB storage)

Configure Network Access:

Go to Network Access → Add IP Address

Click "Allow Access from Anywhere" (for development)

Create Database User:

Go to Database Access → Add New Database User

Set username and password

Grant "Atlas admin" privileges

Get Connection String:

Click "Connect" → "Connect your application"

Copy the connection string

Replace in .env file

---------------------------------------------------------------------------------------------------------------

5. Initialize Database
   
        # Generate Prisma Client
        npx prisma generate
        
        # Push schema to MongoDB
        npx prisma db push
        
        # Seed the database with sample data
        npm run seed
7. Start Backend Server
   
        # Development mode (with hot reload)
        npm run dev
        
        # Production mode
        npm run build
        npm start
        The backend will be running at: http://localhost:5000

7. Frontend Setup
   
        # Open new terminal and navigate to frontend
        cd sweet-shop-frontend
        
        # Install dependencies
        npm install
        
        # Set up environment variables
        cp .env.example .env
        Edit .env in sweet-shop-frontend:
        
        env
        VITE_API_URL=http://localhost:5000/api
        VITE_APP_NAME=Sweet Shop
9. Start Frontend Development Server

        npm run dev
        The frontend will be running at: http://localhost:3000
   
---------------------------------------------------------------------------------------------------------------

📁 Project Structure

      sweet-shop-management/
      ├── sweet-shop-backend/
      │   ├── src/
      │   │   ├── config/          # Configuration files
      │   │   ├── controllers/     # Route controllers
      │   │   ├── middleware/      # Custom middleware
      │   │   ├── routes/          # API routes
      │   │   ├── services/        # Business logic
      │   │   ├── types/           # TypeScript types
      │   │   ├── utils/           # Utility functions
      │   │   ├── app.ts           # Express app setup
      │   │   └── server.ts        # Server entry point
      │   ├── prisma/
      │   │   ├── schema.prisma    # Database schema
      │   │   └── seed.ts          # Database seed data
      │   ├── .env                 # Environment variables
      │   └── package.json
      │
      └── sweet-shop-frontend/
          ├── src/
          │   ├── components/      # Reusable components
          │   ├── contexts/        # React contexts
          │   ├── pages/           # Page components
          │   ├── services/        # API services
          │   ├── types/           # TypeScript types
          │   ├── App.tsx          # Main App component
          │   └── main.tsx         # Entry point
          ├── public/              # Static assets
          ├── .env                 # Environment variables
          └── package.json
          
---------------------------------------------------------------------------------------------------------------

🔧 Available Scripts

      Backend Scripts
      bash
      npm run dev          # Start development server
      npm run build        # Build TypeScript
      npm start           # Start production server
      npm run seed        # Seed database with sample data
      npm test           # Run tests
      npm run lint       # Run ESLint
      npm run format     # Format code with Prettier
      Prisma Commands
      bash
      npx prisma generate    # Generate Prisma Client
      npx prisma db push     # Push schema to MongoDB
      npx prisma studio      # Open Prisma Studio GUI
      npx prisma migrate dev # Create migrations (for SQL)
      Frontend Scripts
      bash
      npm run dev          # Start development server
      npm run build        # Build for production
      npm run preview      # Preview production build
      npm run lint         # Run ESLint

---------------------------------------------------------------------------------------------------------------

📊 Database Schema

    User Model
    prisma
    model User {
      id        String   @id @default(auto()) @map("_id") @db.ObjectId
      email     String   @unique
      password  String
      name      String
      role      String   @default("CUSTOMER")
      createdAt DateTime @default(now())
      updatedAt DateTime @updatedAt
      
      purchases Purchase[]
      restocks  Restock[]
    }
    Sweet Model
    prisma
    model Sweet {
      id          String   @id @default(auto()) @map("_id") @db.ObjectId
      name        String   @unique
      description String?
      category    String
      price       Float
      quantity    Int      @default(0)
      imageUrl    String?
      isActive    Boolean  @default(true)
      createdAt   DateTime @default(now())
      updatedAt   DateTime @updatedAt
    
      purchases Purchase[]
      restocks  Restock[]
    }

---------------------------------------------------------------------------------------------------------------

🔐 API Endpoints

    Authentication
    POST /api/auth/register - Register new user
    
    POST /api/auth/login - Login user
    
    GET /api/auth/profile - Get user profile
    
    POST /api/auth/verify - Verify JWT token
    
    Sweets
    GET /api/sweets - Get all sweets
    
    GET /api/sweets/:id - Get sweet by ID
    
    POST /api/sweets - Create sweet (Admin only)
    
    PUT /api/sweets/:id - Update sweet (Admin only)
    
    DELETE /api/sweets/:id - Delete sweet (Admin only)
    
    GET /api/sweets/search - Search sweets with filters
    
    GET /api/sweets/categories - Get all categories
    
    POST /api/sweets/:id/purchase - Purchase sweet
    
    POST /api/sweets/:id/restock - Restock sweet (Admin only)
    
    Users (Admin only)
    GET /api/users - Get all users
    
    GET /api/users/stats - Get user statistics
    
    GET /api/users/:id - Get user by ID
    
    PUT /api/users/:id - Update user
    
    DELETE /api/users/:id - Delete user
    
    Inventory
    GET /api/inventory/low-stock - Get low stock items
    
    GET /api/inventory/purchases - Get purchase history
    
    GET /api/inventory/restocks/:id - Get restock history

---------------------------------------------------------------------------------------------------------------

👤 Default Credentials

    After seeding the database:
    
    Admin Account
    Email: admin@sweetshop.com
    
    Password: Admin123!

---------------------------------------------------------------------------------------------------------------

📝 Environment Variables Reference

        Backend (.env)
        Variable	Description	Example
        DATABASE_URL	MongoDB connection string	mongodb+srv://user:pass@cluster.mongodb.net/db
        PORT	Server port	5000
        NODE_ENV	Environment	development/production
        JWT_SECRET	JWT signing secret	your-secret-key
        JWT_EXPIRES_IN	Token expiry	24h
        ADMIN_EMAIL	Default admin email	admin@sweetshop.com
        ADMIN_PASSWORD	Default admin password	Admin123!
        Frontend (.env)
        Variable	Description	Example
        VITE_API_URL	Backend API URL	http://localhost:5000/api
        VITE_APP_NAME	Application name	Sweet Shop

---------------------------------------------------------------------------------------------------------------

🔄 Database Migration

      From Development to Production
      Export development data: npx prisma db pull
      
      Import to production: npx prisma db push
      
      Update connection string in production .env
      
      Backup Database
      bash
      # Using MongoDB tools
      mongodump --uri="your_connection_string" --out=./backup
      
      # Restore from backup
      mongorestore --uri="your_connection_string" ./backup
      🤝 Contributing
      Fork the repository
      
      Create a feature branch: git checkout -b feature-name
      
      Commit changes: git commit -m 'Add feature'
      
      Push to branch: git push origin feature-name
      
      Open a Pull Request

---------------------------------------------------------------------------------------------------------------


Run tests:

    # Run all tests
    npm test
    
    # Run specific test file
    npm test -- src/tests/auth.test.ts
    
    # Run with coverage
    npm run test:coverage
    
    # Watch mode (for development)
    npm run test:watch

---------------------------------------------------------------------------------------------------------------

7. Test Output Examples
   
        Successful Test Output:
        text
         PASS  src/tests/auth.test.ts
          Auth API
            POST /api/auth/register
              ✓ should register a new user (45 ms)
              ✓ should fail with existing email (32 ms)
            POST /api/auth/login
              ✓ should login with valid credentials (38 ms)
              ✓ should fail with invalid credentials (21 ms)
        
        Test Suites: 1 passed, 1 total
        Tests:       4 passed, 4 total
        Snapshots:   0 total
        Time:        1.234 s

---------------------------------------------------------------------------------------------------------------

Coverage Report:

        ----------------------|---------|----------|---------|---------|-------------------
        File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
        ----------------------|---------|----------|---------|---------|-------------------
        All files             |   85.42 |    76.92 |   83.33 |   86.36 |
         src/controllers      |   91.67 |    83.33 |   90.91 |   92.31 |
          auth.controller.ts  |   91.67 |    83.33 |   90.91 |   92.31 |
         src/services         |   83.33 |    75.00 |   80.00 |   84.62 |
          auth.service.ts     |   83.33 |    75.00 |   80.00 |   84.62 |
        ----------------------|---------|----------|---------|---------|-------------------

---------------------------------------------------------------------------------------------------------------

8. Troubleshooting Test Issues

        If tests fail to run:
        bash
        # Clear jest cache
        npx jest --clearCache
        
        # Check TypeScript compilation
        npx tsc --noEmit
        
        # Run with verbose output
        npm test -- --verbose
        
        # Debug specific test
        npm test -- --testNamePattern="should register" --verbose
        If Prisma client fails in tests:
        bash
        # Generate Prisma client for tests
        npx prisma generate
        
        # Use in-memory database for tests
        # Update .env.test to use SQLite
        DATABASE_URL="file:./test.db"

---------------------------------------------------------------------------------------------------------------

10. Quick Test Commands Cheat Sheet

        # Basic commands
        npm test                    # Run all tests
        npm run test:watch         # Watch mode
        npm run test:coverage      # With coverage
        
        # Advanced commands
        npm test -- --testNamePattern="auth"    # Run specific tests
        npm test -- --coverage --watchAll       # Coverage in watch mode
        npm test -- --verbose                   # Detailed output
        npm test -- --detectOpenHandles         # Detect async issues
        
        # Clear and reset
        npx jest --clearCache      # Clear cache
        rm -rf coverage           # Remove coverage reports

---------------------------------------------------------------------------------------------------------------

Development Guidelines

    Follow TypeScript best practices
    
    Write tests for new features
    
    Update documentation
    
    Follow existing code style

---------------------------------------------------------------------------------------------------------------

🎯 Roadmap
Phase 1 (Current) ✅
User authentication

Basic sweet management

Shopping cart

Admin dashboard

Phase 2 (In Progress) 🚧
Payment integration

Order tracking

Email notifications

Reviews & ratings

Phase 3 (Planned) 📅
Mobile app

Loyalty program

Advanced analytics

Multi-vendor support


