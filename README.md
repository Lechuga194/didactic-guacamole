# Cocina · Costeo y ventas para dark kitchen

App local (Mac) para costear recetas, fijar precios por canal y registrar ventas de DiDi, Uber, Rappi y venta directa con su **utilidad real** (después de IVA, comisión, retenciones y costo de producción).

- **Backend:** Node + Express 5 + TypeScript + Knex + SQLite (`better-sqlite3`), Socket.io para datos en vivo.
- **Frontend:** Angular 22 + Angular Material.
- **OCR local:** Tesseract (`tesseract.js`, español + inglés, sin internet) para leer capturas de tickets.

## Requisitos (Mac)

1. **Node.js 22 o superior** (`node -v`). Recomendado instalarlo desde nodejs.org o con `brew install node`.
2. **Herramientas de línea de comandos de Xcode**, necesarias para compilar SQLite: `xcode-select --install`.

## Instalación y uso

```bash
npm install      # instala raíz, backend y frontend
npm start        # levanta API (puerto 3000) y web (puerto 4200) y abre el navegador
```

La primera vez se crea `backend/data/cocina.sqlite` aplicando los DDL de `backend/database/ddl` (esquema + catálogos + datos importados de tu Excel).
Cada día, al arrancar, se guarda un respaldo en `backend/data/backups/`.

Otros comandos: `npm test` (pruebas del backend), `npm run start:api`, `npm run start:web`.

## Pantallas

| Pantalla | Para qué sirve |
| --- | --- |
| **Hoy** | Resumen en vivo del día: venta neta, utilidad real, metas, por canal, por hora, más vendidos y pedidos. |
| **Registrar venta** | Captura por pedido: canal, productos (accesos rápidos y buscador), modificadores, combos y promociones. La utilidad se calcula al instante. Pega (⌘V) o arrastra la captura del ticket para autollenar. |
| **Ventas** | Historial con filtros, totales y edición. |
| **Dashboard** | Tendencia diaria, rentabilidad por canal, productos estrella, ingeniería de menú, mapa de calor día/hora, categorías, punto de equilibrio, impuestos y costo de promociones. |
| **Precios y márgenes** | Equivalente a la hoja *Venta*: costo, precio por canal (editable), utilidad, margen, precio sugerido y simulador. |
| **Alertas** | Productos con pérdida o bajo la meta, alzas de costos, recetas incompletas. |
| **Recetas / Ingredientes** | Catálogo con costo recursivo (preparaciones dentro de recetas) y edición rápida de costos. |
| **Modificadores / Promociones** | Catálogos que alimentan el registro de ventas y el OCR. |
| **Configuración** | Margen objetivo, IVA, comisiones y retenciones por canal, metas, gastos fijos, exportar a Excel y respaldos. |

## Cómo se calcula la utilidad

Precios con IVA incluido. Para un pedido:

```
venta neta   = productos + modificadores − descuentos que paga la tienda
IVA          = venta neta × 16/116
comisión     = venta neta × % del canal
ISR retenido = (venta neta − IVA) × % de retención
utilidad     = venta neta − IVA − comisión − ISR retenido − costo de producción
depósito     = venta neta − comisión − ISR retenido − IVA retenido
```

El IVA retenido no es gasto (se acredita en tu declaración mensual). El **precio sugerido** es el que deja el margen objetivo (25% por defecto) después de todo lo anterior, redondeado hacia arriba a múltiplos de $5.

> Las retenciones por defecto (ISR 2.5%, IVA 50%) siguen el régimen de plataformas digitales con la reforma 2026. Confírmalas con tu contador y ajústalas en *Configuración → Canales*.

## Base de datos y DDL

`backend/database/ddl/` contiene los scripts SQL versionados que se aplican en orden, una sola vez, y quedan registrados en la tabla `schema_migrations`:

| Archivo | Contenido |
| --- | --- |
| `001_schema.sql` | Tablas, índices, columnas calculadas y triggers (historial de costos y precios). |
| `002_seed_catalogs.sql` | Parámetros, canales y modificadores observados en los tickets. |
| `003_seed_excel.sql` | Ingredientes, recetas, componentes y precios importados de la plantilla de Excel. |

Para cambiar el esquema agrega un archivo nuevo (`004_...sql`); nunca edites uno ya aplicado.
`003_seed_excel.sql` se genera con `backend/database/tools/excel_to_seed.py <plantilla.xlsx> <salida.sql>` (Python + openpyxl).

### Correcciones aplicadas al importar el Excel

- Molletes (3 variantes): rendimiento 1, porque un bolillo partido a la mitad es una orden. Antes el costo salía a la mitad.
- Sincronizadas: se creó la preparación *Sincronizada base (3 piezas)*, la orden *Sincronizadas* (3 piezas + empaque) y *Sincronizada extra (pieza)* sin empaque, con precio inicial de $20 (ajústalo). Se corrigió la tortilla de harina que el Excel contaba en $0.
- Moon Milk frío: se unificó el nombre y se quitó una fila vacía.
- Códigos de ingrediente repetidos (ING077 ×6, ING091 ×2) se renumeraron como ING103–ING108.
- Empaques y desechables se marcaron como tipo *empaque* para ver su peso en el costo.
- Comisión de DiDi en 30%, como aparece en sus tickets. Rappi queda en 31%.

## Lectura de tickets (OCR)

- Funciona con capturas de **DiDi Food** (portal de tienda) y **Uber Eats** (Orders) en PNG o JPG.
- Detecta la plataforma, la fecha y hora, el folio, los productos con sus modificadores (por sangría), los combos, el descuento de tienda, la comisión y la ganancia reportada.
- Empareja cada producto con una receta usando su nombre y los modificadores que definen la variante. Por ejemplo, *Molletes + Tocino* se empareja con *molletes de tocino*.
- **Aprende**: cuando corriges un producto y guardas, la próxima vez lo reconoce igual.
- Siempre se revisa antes de guardar. Si un combo no existe, se puede crear con un clic.

## Estructura

```
backend/
  database/ddl/          DDL versionados (esquema + seeds)
  database/tools/        generador del seed desde Excel
  src/app.ts             punto de entrada
  src/config/            conexión SQLite y constantes
  src/models/            Server (Express) y Socket.io
  src/routes/            index.ts + un *.route.ts por dominio
  src/controllers/       HTTP + orquestación (try/catch/finally + db.destroy)
  src/services/          BD y proveedores (OCR, respaldos, Excel)
  src/middleware/        validación Joi y multer
  src/interfaces/        tipos
  src/utils/             cálculos puros (costos, precios, parser de tickets) + pruebas
frontend/
  src/app/core/          API, tiempo real, formato, cálculo de precios
  src/app/shared/        gráficas, KPIs, diálogos
  src/app/features/      una carpeta por pantalla
```
