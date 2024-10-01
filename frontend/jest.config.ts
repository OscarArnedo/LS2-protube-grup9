import type {Config} from 'jest';

const config: Config = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/jest.polyfills.js"],
  testEnvironmentOptions: {
    customExportConditions: [''],
  }
};

export default config;
