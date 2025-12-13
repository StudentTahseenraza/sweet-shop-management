module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/tests/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/tests/**',
    '!src/**/index.ts'
  ],
  coverageDirectory: 'coverage',
  verbose: true,
  testTimeout: 30000,
  setupFiles: ['dotenv/config'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  // Add transformIgnorePatterns to handle uuid ES modules
  transformIgnorePatterns: [
    'node_modules/(?!(uuid)/)'  // Transform uuid package
  ],
  // Or use moduleNameMapper as alternative
  moduleNameMapper: {
    '^uuid$': require.resolve('uuid')  // Force CommonJS version
  }
};