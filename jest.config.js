module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'server.js',
    'src/**/*.js',
    '!src/**/*.test.js',
  ],
  testMatch: ['**/tests/**/*.test.js'],
  verbose: true,
};
