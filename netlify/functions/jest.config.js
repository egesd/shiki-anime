module.exports = {
  testEnvironment: 'node',
  testTimeout: 10000,
  verbose: true,
  testMatch: ['**/tests/**/*.test.js'],
  collectCoverageFrom: [
    '**/*.js',
    '!**/node_modules/**',
    '!**/tests/**',
    '!jest.config.js'
  ],
  setupFiles: ['<rootDir>/tests/setup.js'],
  setupFilesAfterEnv: ['./jest.setup.js']
};