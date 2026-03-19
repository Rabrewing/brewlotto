export default {
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.js'],
  transform: {},
  moduleFileExtensions: ['js', 'mjs'],
  collectCoverageFrom: [
    'lib/**/*.js',
    'scripts/**/*.js',
    '!scripts/**/*.test.js',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html'],
  verbose: true,
  testTimeout: 10000,
};
