import { defineConfig } from 'vitest/config';

// Tests de firestore.rules: necesitan el emulador (npm run test:reglas).
export default defineConfig({
  test: {
    include: ['pruebas/**/*.test.ts'],
    environment: 'node',
    testTimeout: 15000,
    fileParallelism: false,
  },
});
