import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { RegisterPage } from '../pages/RegisterPage';

export const CLAVE_VALIDA = 'Examen#2026a'; // 12 caracteres: mayúscula, minúscula, número y especial

function loginUnico() {
  const d = new Date();
  const hora = `${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
  return `bj11094_${hora}`;
}

test.describe('HU-1 Registro de usuario', () => {
  test('Caso 1 - Registro con datos válidos (C1, C2)', async ({ page }, testInfo) => {
    const registro = new RegisterPage(page);
    const login = loginUnico();
    await registro.abrir();

    // C1: con los campos vacíos no se puede registrar
    await expect(registro.botonRegistrar).toBeDisabled();

    await registro.registrar(login, 'Brayan', 'Corado', CLAVE_VALIDA);
    await expect(registro.mensajeExito).toBeVisible();

    // El caso 3 usa este mismo usuario para no crear usuarios adicionales
    fs.writeFileSync('.usuario-examen.json', JSON.stringify({ login, clave: CLAVE_VALIDA }));
    console.log(`Usuario creado: ${login}`);
    await testInfo.attach('usuario-creado', { body: login, contentType: 'text/plain' });
    await page.screenshot({ path: 'evidencias/automaticos/caso1-registro-exitoso.png' });
  });

  test('Caso 2 - Clave de 7 caracteres es rechazada (C2)', async ({ page }) => {
    const registro = new RegisterPage(page);
    await registro.abrir();
    await registro.registrar(loginUnico() + 'x', 'Brayan', 'Corado', 'Ab1#cde'); // 7 caracteres

    await expect(registro.mensajeError).toBeVisible();
    await expect(registro.mensajeExito).toHaveCount(0);
    await page.screenshot({ path: 'evidencias/automaticos/caso2-clave-7-rechazada.png' });
  });
});