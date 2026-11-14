import { defineConfig, devices } from '@playwright/test';

/**
 * Examen final - Buggy Cars Rating (https://buggy.justtestit.org)
 * Evidencia: capturas + trazas, SIN video (lo pidió el ingeniero).
 */
export default defineConfig({
  testDir: './tests',

  // El backend de Buggy Cars a veces responde lento
  timeout: 60_000,
  expect: { timeout: 10_000 },

  fullyParallel: false,
  workers: 1,   // un test a la vez: evita choques de datos (registro, votos, perfil)
  retries: 0,   // sin reintentos: un test frágil se corrige, no se disimula

  reporter: [
    ['list'],
    ['html', { open: 'never', outputFolder: 'playwright-report' }],
  ],
  outputDir: 'test-results',

  use: {
    baseURL: 'https://buggy.justtestit.org',
    headless: true,       // usa --headed para ver el navegador
    screenshot: 'on',     // captura en cada test
    trace: 'on',          // traza: DOM, red y consola por acción
    video: 'off',         // sin video
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    viewport: { width: 1366, height: 768 },
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 768 } } },
    { name: 'firefox',  use: { ...devices['Desktop Firefox'], viewport: { width: 1366, height: 768 } } },
  ],
});