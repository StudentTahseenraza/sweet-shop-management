Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Complete Prisma Reset" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 1. Clean up old files
Write-Host "`n1. Cleaning up old files..." -ForegroundColor Yellow
Remove-Item -Path "prisma\dev.db" -ErrorAction SilentlyContinue
Remove-Item -Path "prisma\prisma.config.ts" -ErrorAction SilentlyContinue

# 2. Create fresh .env with SQLite
Write-Host "`n2. Setting up environment..." -ForegroundColor Yellow
@'
DATABASE_URL="file:./dev.db"
PORT=5000
NODE_ENV=development
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_EXPIRES_IN="24h"
ADMIN_EMAIL="admin@sweetshop.com"
ADMIN_PASSWORD="Admin123!"
'@ | Out-File ".env" -Encoding UTF8

# 3. Create Prisma config
Write-Host "`n3. Creating Prisma config..." -ForegroundColor Yellow
@'
import { defineConfig } from 'prisma/config';
import { env } from 'process';

export default defineConfig({
  datasourceUrl: env.DATABASE_URL,
});
'@ | Out-File "prisma\prisma.config.ts" -Encoding UTF8

# 4. Update schema for SQLite
Write-Host "`n4. Updating schema for SQLite..." -ForegroundColor Yellow
$schemaContent = @'
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
}

model User {
  id        String    @id @default(uuid())
  email     String    @unique
  password  String
  name      String
  role      UserRole  @default(CUSTOMER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  
  purchases Purchase[]
  restocks  Restock[]

  @@map("users")
}

enum UserRole {
  CUSTOMER
  ADMIN
}

model Sweet {
  id          String    @id @default(uuid())
  name        String    @unique
  description String?
  category    String
  price       Float
  quantity    Int       @default(0)
  imageUrl    String?   @db.Text
  isActive    Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt

  purchases Purchase[]
  restocks  Restock[]

  @@map("sweets")
}

model Purchase {
  id         String   @id @default(uuid())
  sweetId    String
  userId     String
  quantity   Int
  totalPrice Float
  createdAt  DateTime @default(now())

  sweet      Sweet    @relation(fields: [sweetId], references: [id], onDelete: Cascade)
  user       User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("purchases")
}

model Restock {
  id        String   @id @default(uuid())
  sweetId   String
  userId    String
  quantity  Int
  createdAt DateTime @default(now())

  sweet     Sweet    @relation(fields: [sweetId], references: [id], onDelete: Cascade)
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("restocks")
}
'@

Set-Content -Path "prisma\schema.prisma" -Value $schemaContent -Encoding UTF8

# 5. Update database config
Write-Host "`n5. Updating database config..." -ForegroundColor Yellow
$dbConfig = @'
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

export default prisma;
'@

Set-Content -Path "src\config\database.ts" -Value $dbConfig -Encoding UTF8

# 6. Run Prisma commands
Write-Host "`n6. Running Prisma setup..." -ForegroundColor Yellow
npx prisma format
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma format failed" -ForegroundColor Red
    exit 1
}

npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma generate failed" -ForegroundColor Red
    exit 1
}

npx prisma db push --accept-data-loss
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Prisma db push failed" -ForegroundColor Red
    exit 1
}

# 7. Seed database
Write-Host "`n7. Seeding database..." -ForegroundColor Yellow
npm run prisma:seed
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Database seeding failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Completed Successfully!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "`nTo start the server: npm run dev" -ForegroundColor Yellow
Write-Host "Server will run on: http://localhost:5000" -ForegroundColor Yellow
Write-Host "`nAdmin credentials:" -ForegroundColor Yellow
Write-Host "  Email: admin@sweetshop.com" -ForegroundColor White
Write-Host "  Password: Admin123!" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan