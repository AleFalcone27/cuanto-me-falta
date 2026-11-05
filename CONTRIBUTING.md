# Guía para colaborar

¡Gracias por querer sumarte a **¿Cuánto me falta?**! Esta es una guía corta para que tu aporte llegue sin vueltas.

## Formas de colaborar

- **Reportar errores**: abrí un [issue](https://github.com/AleFalcone27/cuanto-me-falta/issues) describiendo qué pasó, qué esperabas que pasara, y los pasos para reproducirlo. Si podés, sumá una captura de pantalla.
- **Proponer ideas**: abrí un issue con la etiqueta de mejora y contá qué problema resolvería.
- **Escribir código o documentación**: seguí los pasos de abajo.

> ⚠️ **No subas datos personales.** Antes de adjuntar capturas, archivos o fragmentos de HTML de Guaraní, borrá tu nombre, DNI, legajo y notas.

## Paso a paso

1. **Hacé un fork** del repositorio desde GitHub.
2. **Cloná tu fork**:
   ```bash
   git clone https://github.com/TU_USUARIO/cuanto-me-falta.git
   cd cuanto-me-falta
   ```
3. **Creá una rama** con un nombre descriptivo:
   ```bash
   git checkout -b fix/filtro-busqueda
   ```
4. **Hacé tus cambios** y probalos (ver abajo).
5. **Hacé commit** con un mensaje claro, en presente:
   ```bash
   git commit -m "Corrige la búsqueda sin acentos en el filtro"
   ```
6. **Subí la rama** y abrí un **pull request** contra `main`, explicando qué cambiaste y por qué.

## Cómo probar los cambios

- **Vista previa rápida**: abrí `preview.html` en el navegador. Usa datos ficticios y no requiere iniciar sesión.
- **Extensión instalada**: en `chrome://extensions`, cargá la carpeta con **Cargar descomprimida**. Después de cada cambio, tocá el botón de recargar de la extensión y recargá la página de Guaraní.
- Revisá que no haya errores en la consola del navegador (F12 → Consola).

## Pautas de código

- JavaScript sin dependencias ni paso de compilación: la extensión se carga tal cual está.
- Mantené el estilo del código existente (nombres, indentación, estructura).
- La lógica pura (parseo, estados, promedio) va en `core.js`; lo que toca la página va en `content.js`.
- **Privacidad ante todo**: no agregues pedidos a servidores externos, analíticas ni permisos nuevos sin discutirlo antes en un issue.
- Si cambiás algo visible, actualizá la versión en `manifest.json` y agregá una línea al historial en el `README.md`.

## Antes de abrir el pull request

- [ ] Probé el cambio en `preview.html` o con la extensión instalada.
- [ ] No hay errores en la consola.
- [ ] No incluí datos personales.
- [ ] Actualicé la documentación si hacía falta.

## Convivencia

Tratemos a todos con respeto. Las críticas son al código, nunca a las personas. Cualquier aporte, por chico que sea, suma.
