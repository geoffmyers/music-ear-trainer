import { defineConfig } from 'vitest/config';
import path from 'path';

// Pure-logic test suite: lib/music and lib/game have no DOM or Web Audio
// dependency, so the default 'node' environment is enough - no jsdom needed.
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.')
    }
  },
  test: {
    include: ['lib/**/*.test.ts'],
    environment: 'node'
  }
});
