export const testUsers = {
  admin: {
    email: 'admin@test.com',
    password: 'Admin123!',
    name: 'Test Admin',
    role: 'ADMIN' as const,
  },
  customer: {
    email: 'customer@test.com',
    password: 'Customer123!',
    name: 'Test Customer',
    role: 'CUSTOMER' as const,
  },
};

export const testSweet = {
  name: 'Test Chocolate',
  description: 'Test description',
  category: 'Chocolate',
  price: 5.99,
  quantity: 50,
  imageUrl: 'https://test.com/image.jpg',
};