# Examen Final – QA · Buggy Cars Rating (Serie III)

Brayan Josué Corado Robles · Carné 1790-22-11094
Curso 048 – Aseguramiento de la Calidad del Software · UMG

Sitio bajo prueba: https://buggy.justtestit.org

## Documentos en Google Drive
- Casos de prueba (Excel) y reporte de errores (Word): **[https://drive.google.com/drive/folders/17GJmD55kuwIPfT2QojzX94ZN_GZ8atpP?usp=sharing]**

Los mismos documentos también están en la carpeta `docs/` de este repositorio.

## Navegador utilizado
- **Casos automatizados (1, 2 y 3):** Chromium, ejecutado con Playwright (`--project=chromium`).
- **Casos manuales (4 y 5):** Microsoft Edge en Windows 11.

## Requisitos
- Node.js 20 o superior
- Git

## Instalación
```
npm install
npx playwright install chromium
```

## Ejecución de los tests automatizados
```
npx playwright test --project=chromium
npx playwright show-report
```

- El **caso 1** registra un usuario nuevo y lo guarda en `.usuario-examen.json` (archivo local, excluido del repositorio).
- El **caso 3** inicia sesión con ese mismo usuario, así no se crean usuarios adicionales.
- El sitio es compartido y un usuario solo puede votar una vez por auto, por lo que la suite se ejecuta **una sola vez**. Cada ejecución crea un usuario y registra un voto.
- Como alternativa, el caso 3 puede usar un usuario existente con variables de entorno:
  ```
  $env:BUGGY_USER="<usuario>"; $env:BUGGY_PASS="<clave>"
  npx playwright test tests/hu3-votar.spec.ts --project=chromium
  ```

## Casos de prueba
| Caso | Historia | Tipo | Archivo / evidencia | Resultado |
|---|---|---|---|---|
| 1 | HU-1 (C1, C2) Registro con datos válidos | Automatizado | `tests/hu1-registro.spec.ts` | OK |
| 2 | HU-1 (C2) Registro con clave de 7 caracteres | Automatizado | `tests/hu1-registro.spec.ts` | OK (rechazado, ver BUG-001) |
| 3 | HU-3 (C1, C2, C4) Votar con comentario | Automatizado | `tests/hu3-votar.spec.ts` | FALLO (BUG-002) |
| 4 | HU-2 (C1) Actualizar perfil con datos válidos | Manual | `evidencias/manuales/caso4-*.png` | OK |
| 5 | HU-2 (C3) Edad con letras | Manual | `evidencias/manuales/caso5-edad-con-letras.png` | FALLO (BUG-003) |

Resultado de la ejecución automatizada: **2 passed, 1 failed**. El caso 3 falla en la verificación del comentario, que es un defecto del sitio documentado como BUG-002. El test no se modificó para que pase.

## Estructura del repositorio
```
pages/                      Page Objects (RegisterPage, LoginBar)
tests/                      Tests automatizados de los casos 1, 2 y 3
evidencias/automaticos/     Capturas generadas por los tests
evidencias/manuales/        Capturas de los casos manuales 4 y 5
docs/                       Casos de prueba (Excel) y reporte de errores (Word)
playwright-report/          Reporte HTML de Playwright con capturas y trazas
playwright.config.ts        Configuración (baseURL, capturas, trazas, navegadores)
```

## Defectos encontrados
Documentados en `docs/Reporte de errores - Buggy Cars.docx`:
- **BUG-001 (HU-1, C4):** al rechazar una clave de 7 caracteres se muestra un mensaje técnico (`InvalidPasswordException`).
- **BUG-002 (HU-3, C4):** después de votar, el comentario no aparece en la tabla de comentarios y la columna Author está vacía.
- **BUG-003 (HU-2, C3):** el campo Age acepta letras y al guardar muestra "Unknown error".

## Notas
- Las capturas y trazas se generan automáticamente (`screenshot: 'on'`, `trace: 'on'`, sin video).
- Un timeout aislado al cargar el sitio corresponde al ambiente (sitio compartido); se repitió la ejecución y pasó.