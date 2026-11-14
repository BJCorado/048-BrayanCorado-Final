import { Page, Locator } from '@playwright/test';

export class RegisterPage {
  readonly login: Locator;
  readonly nombre: Locator;
  readonly apellido: Locator;
  readonly clave: Locator;
  readonly confirmar: Locator;
  readonly botonRegistrar: Locator;
  readonly mensajeExito: Locator;
  readonly mensajeError: Locator;

  constructor(private page: Page) {
    this.login = page.locator('#username');
    this.nombre = page.locator('#firstName');
    this.apellido = page.locator('#lastName');
    this.clave = page.locator('#password');
    this.confirmar = page.locator('#confirmPassword');
    this.botonRegistrar = page.getByRole('button', { name: 'Register' });
    this.mensajeExito = page.getByText('Registration is successful');
    // Solo el mensaje visible que aparece después de enviar (los de validación de campos están ocultos)
    this.mensajeError = page.locator('.alert-danger:visible');
  }

  async abrir() {
    await this.page.goto('/register');
    await this.login.waitFor();
  }

  async registrar(login: string, nombre: string, apellido: string, clave: string) {
    await this.login.fill(login);
    await this.nombre.fill(nombre);
    await this.apellido.fill(apellido);
    await this.clave.fill(clave);
    await this.confirmar.fill(clave);
    await this.botonRegistrar.click();
  }
}