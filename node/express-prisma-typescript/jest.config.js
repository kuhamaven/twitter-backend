module.exports = {
    preset: 'ts-jest',
    testEnvironment: '@quramy/jest-prisma/environment',
    moduleFileExtensions: ['ts', 'tsx', 'js'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest',
    },
    testMatch: ['**/?(*.)+(spec|test).ts'],
    moduleNameMapper: {
        '^@utils(.*)$': '<rootDir>/src/utils$1',
        '^@domains/(.*)$': '<rootDir>/src/domains/$1',
    },
};
