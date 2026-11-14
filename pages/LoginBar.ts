import { Page, Locator, expect } from '@playwright/test';

export class LoginBar {
  readonly usuario: Locator;
  readonly clave: Locator;
  readonly botonLogin: Locator;
  readonly barra: Locator;

  constructor(private page: Page) {
    this.usuario = page.locator('input[name="login"]');
    this.clave = page.locator('nav input[name="password"]');
    this.botonLogin = page.getByRole('button', { name: 'Login' });
    this.barra = page.locator('nav');
  }

  async iniciarSesion(usuario: string, clave: string) {
    await this.page.goto('/');
    await this.usuario.fill(usuario);
    await this.clave.fill(clave);
    await this.botonLogin.click();
    await expect(this.barra).toContainText('Hi,');
  }
}