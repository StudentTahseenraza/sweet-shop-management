import dotenv from 'dotenv';

module.exports = async () => {
  dotenv.config({ path: '.env.test' });
  console.log('Global test setup completed');
};