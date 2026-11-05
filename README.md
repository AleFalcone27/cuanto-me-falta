# ¿Cuánto me falta?

Extensión de Chrome para el SIU Guaraní de la UNLa. Muestra el plan 2025 de la Licenciatura en Sistemas como un mapa: materias por año y cuatrimestre, el estado de cada una, tu promedio y las correlativas.

No es un proyecto oficial de la Universidad Nacional de Lanús ni del consorcio SIU.

## Qué hace

- Ordena las materias por año y cuatrimestre. Podés filtrarlas por estado o por año, y buscarlas por nombre o código.
- Pinta cada materia según su estado: verde si está aprobada, amarillo si la estás cursando, gris si está pendiente.
- Al hacer clic en una materia, muestra el estado, la nota y cómo se aprobó (examen, promoción o equivalencia).
- Calcula el promedio simple de las notas numéricas de las materias aprobadas o promocionadas. Cuenta los seminarios y deja afuera los módulos de ingreso. No es el promedio histórico oficial.
- Dibuja el mapa completo de correlativas, para cursar o para aprobar. Si pasás el mouse sobre una materia, se marcan las que dependen de ella y las que necesita.
- Tiene una vista por materia: a la izquierda lo que pide, a la derecha lo que habilita.

El avance cuenta materias, no créditos, y no reemplaza al porcentaje oficial. "Pendiente" quiere decir que Guaraní no registra una aprobación ni una cursada en curso. No dice si estás en condiciones de anotarte.

## Instalación

1. Descargá el repositorio:
   ```bash
   git clone https://github.com/AleFalcone27/cuanto-me-falta.git
   ```
2. En Chrome, entrá a `chrome://extensions` y activá el **Modo desarrollador**.
3. Tocá **Cargar descomprimida** y elegí la carpeta del repositorio, la que tiene `manifest.json`.
4. Iniciá sesión en [estudiantes.unla.edu.ar/autogestion3w](https://estudiantes.unla.edu.ar/autogestion3w/plan_estudio).
5. Tocá **¿Cuánto me falta?**, al final de la barra de navegación. Desde cualquier página de Guaraní te lleva al plan y abre el mapa.

Para desinstalarla, buscá "¿Cuánto me falta?" en `chrome://extensions` y tocá **Quitar**.

## Privacidad

La extensión lee la tabla del plan y las correlativas que ya muestra Guaraní, y las procesa en tu navegador. No manda datos a ningún servidor, no usa analíticas ni guarda nada, y no cambia tus registros académicos.

## Archivos

| Archivo | Qué contiene |
| --- | --- |
| `manifest.json` | Configuración de la extensión (Manifest V3). |
| `core.js` | Lectura de las filas del plan, cálculo de estados y promedio. |
| `prerequisites.js` | Lectura de las correlativas desde los botones "Ver" de Guaraní. |
| `content.js` | Interfaz que se agrega a Guaraní: vistas y mapas. |
| `popup.html` | Ventana que se abre desde el ícono de la extensión. |
| `preview.html` | Vista previa que funciona sin iniciar sesión. |
| `preview-data.js` | Datos inventados para la vista previa. |
| `preview-prerequisites.js` | Correlativas del plan 2025 (versión 2) para la vista previa. |
| `button-preview.html` | Vista previa del botón de la barra de navegación. |
| `guarani-logo.png` | Logo del botón para volver a Guaraní. |

## Probar sin Guaraní

Abrí `preview.html` en el navegador. Usa datos inventados y no pide usuario. Sirve para revisar cambios visuales rápido.

## Versiones

- **1.9.0**: las flechas de correlativas también aparecen en la pestaña Plan de estudios.
- **1.8.x**: mapa completo de correlativas, ajuste al ancho de la pantalla, tarjetas más grandes, flechas que no se pisan y seminarios en una sección aparte.
- **1.7.0**: correlativas por materia.
- **1.5.0**: pantalla de carga.
- **1.4.1**: arreglo de la carga al abrir el mapa desde otras páginas de Guaraní.
- **1.1.0**: rediseño con los colores de la UNLa (#7C1331 y #B8283A).

## Código abierto

El proyecto es de código abierto y se publica con [licencia MIT](LICENSE): podés usarlo, modificarlo y redistribuirlo. Si encontrás un error o querés sumar algo, abrí un issue o un pull request. Los pasos están en la [guía para colaborar](CONTRIBUTING.md).
