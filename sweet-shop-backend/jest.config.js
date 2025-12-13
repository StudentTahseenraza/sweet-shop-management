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
  // Add this to ignore TypeScript errors in tests:
  globals: {
    'ts-jest': {
      isolatedModules: true
    }
  },
  // Or use transform to skip type checking:
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      isolatedModules: true,
      diagnostics: {
        ignoreCodes: [6133] // Ignore "unused variable" errors
      }
    }]
  }
};