import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import { LoginBar } from '../pages/LoginBar';

function credenciales() {
  // Primero el usuario creado por el caso 1; si no existe, las variables de entorno
  if (fs.existsSync('.usuario-examen.json')) {
    const u = JSON.parse(fs.readFileSync('.usuario-examen.json', 'utf8'));
    return { usuario: u.login as string, clave: u.clave as string };
  }
  return { usuario: process.env.BUGGY_USER ?? '', clave: process.env.BUGGY_PASS ?? '' };
}

test('Caso 3 - Votar por el primer auto de Overall Rating con comentario (HU-3: C1, C2, C4)',
  async ({ page }) => {
    const { usuario, clave } = credenciales();
    test.skip(!usuario || !clave, 'Ejecutar primero el caso 1 o definir BUGGY_USER y BUGGY_PASS');
    test.setTimeout(180_000); // la ficha del primer auto tiene miles de comentarios y carga lento
    const comentario = `Examen QA 11094 ${new Date().toLocaleTimeString()}`;

    await test.step('Iniciar sesión (C1)', async () => {
      await new LoginBar(page).iniciarSesion(usuario, clave);
    });

    await test.step('Abrir el primer auto de Overall Rating', async () => {
      await page.locator('a[href="/overall"]').first().click();
      const primeraFila = page.locator('table tbody tr').first();
      await expect(primeraFila).toBeVisible({ timeout: 30_000 });
      await primeraFila.locator('a[href^="/model/"]').first().click();

      await expect(page.getByText(/Votes:\s*\d+/).first()).toBeVisible({ timeout: 90_000 });
      await expect(page.locator('nav'), 'La sesión debe seguir activa').toContainText('Hi,');
      await expect(page.locator('#comment'), 'C2: el usuario aún no ha votado por este auto')
        .toBeVisible({ timeout: 30_000 });
    });

    const textoVotos = page.getByText(/Votes:\s*\d+/).first();
    const votosAntes = parseInt((await textoVotos.textContent())!.replace(/\D/g, ''), 10);

    await test.step('Votar dejando un comentario', async () => {
      await page.locator('#comment').fill(comentario);
      await page.getByRole('button', { name: 'Vote!' }).click();
    });

    await test.step('Verificar confirmación y contador +1 (C4)', async () => {
      await expect(page.getByText('Thank you for your vote!')).toBeVisible({ timeout: 30_000 });
      await expect(textoVotos).toContainText(`${votosAntes + 1}`, { timeout: 30_000 });
      await expect(page.getByRole('button', { name: 'Vote!' })).toHaveCount(0); // C2
      await page.screenshot({ path: 'evidencias/automaticos/caso3-voto-confirmado.png' });
    });

    await test.step('Verificar comentario con fecha y autor (C4)', async () => {
      const fila = page.locator('table', { hasText: 'Author' }).locator('tbody tr').first();
      await expect(fila.locator('td').nth(2)).toHaveText(comentario, { timeout: 30_000 });
      await expect(fila.locator('td').nth(0)).not.toBeEmpty();
      // Según la historia debe mostrarse el autor; si falla, es un defecto (no se modifica el test)
      expect.soft(await fila.locator('td').nth(1).innerText(), 'Autor del comentario').not.toBe('');
    });
  });