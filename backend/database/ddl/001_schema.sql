-- =====================================================================
-- 001_schema.sql
-- Esquema base de la app de costeo y ventas (SQLite).
-- Los montos se guardan en MXN con IVA incluido salvo que se indique.
-- Los porcentajes se guardan como fracción (0.35 = 35%).
-- =====================================================================

PRAGMA foreign_keys = ON;

-- ---------------------------------------------------------------------
-- Parámetros generales (IVA, margen objetivo, redondeo, metas...)
-- ---------------------------------------------------------------------
CREATE TABLE settings (
	key         TEXT PRIMARY KEY,
	value       TEXT NOT NULL,
	description TEXT
);

-- ---------------------------------------------------------------------
-- Canales de venta y su carga fiscal / comisión
-- ---------------------------------------------------------------------
CREATE TABLE channels (
	id                INTEGER PRIMARY KEY AUTOINCREMENT,
	code              TEXT NOT NULL UNIQUE,
	name              TEXT NOT NULL,
	commission_pct    REAL NOT NULL DEFAULT 0 CHECK (commission_pct >= 0 AND commission_pct < 1),
	isr_ret_pct       REAL NOT NULL DEFAULT 0 CHECK (isr_ret_pct >= 0 AND isr_ret_pct < 1),  -- sobre base sin IVA
	iva_ret_pct       REAL NOT NULL DEFAULT 0 CHECK (iva_ret_pct >= 0 AND iva_ret_pct <= 1), -- fracción del IVA trasladado
	target_margin_pct REAL CHECK (target_margin_pct IS NULL OR (target_margin_pct >= 0 AND target_margin_pct < 1)),
	is_platform       INTEGER NOT NULL DEFAULT 1 CHECK (is_platform IN (0, 1)),
	color             TEXT NOT NULL DEFAULT '#607d8b',
	sort_order        INTEGER NOT NULL DEFAULT 0,
	active            INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);

-- ---------------------------------------------------------------------
-- Ingredientes e insumos de empaque
-- La unidad de uso y el costo por unidad de uso se derivan de la
-- unidad de compra: kg -> g, L -> ml, pieza -> pieza.
-- ---------------------------------------------------------------------
CREATE TABLE ingredients (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	code          TEXT UNIQUE,
	name          TEXT NOT NULL UNIQUE COLLATE NOCASE,
	category      TEXT NOT NULL DEFAULT 'insumo' CHECK (category IN ('insumo', 'empaque')),
	purchase_unit TEXT NOT NULL CHECK (purchase_unit IN ('kg', 'L', 'pieza')),
	purchase_cost REAL NOT NULL DEFAULT 0 CHECK (purchase_cost >= 0),
	use_unit      TEXT GENERATED ALWAYS AS (
		CASE purchase_unit WHEN 'kg' THEN 'g' WHEN 'L' THEN 'ml' ELSE 'pieza' END
	) VIRTUAL,
	unit_cost     REAL GENERATED ALWAYS AS (
		CASE WHEN purchase_unit IN ('kg', 'L') THEN purchase_cost / 1000.0 ELSE purchase_cost END
	) VIRTUAL,
	notes         TEXT,
	active        INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
	created_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
	updated_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- Historial de cambios de costo (lo alimenta un trigger)
CREATE TABLE ingredient_cost_history (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	ingredient_id INTEGER NOT NULL REFERENCES ingredients (id) ON DELETE CASCADE,
	old_cost      REAL,
	new_cost      REAL NOT NULL,
	changed_at    TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX ix_ingredient_cost_history_ingredient ON ingredient_cost_history (ingredient_id, changed_at);

CREATE TRIGGER trg_ingredients_cost_history
AFTER UPDATE OF purchase_cost ON ingredients
WHEN OLD.purchase_cost IS NOT NEW.purchase_cost
BEGIN
	INSERT INTO ingredient_cost_history (ingredient_id, old_cost, new_cost) VALUES (NEW.id, OLD.purchase_cost, NEW.purchase_cost);
	UPDATE ingredients SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

-- ---------------------------------------------------------------------
-- Recetas
--   preparacion    : producto intermedio (salsas, jarabes, masas...)
--   producto_final : lo que se vende
--   combo          : paquete vendible formado por otros productos
-- ---------------------------------------------------------------------
CREATE TABLE recipes (
	id          INTEGER PRIMARY KEY AUTOINCREMENT,
	name        TEXT NOT NULL UNIQUE COLLATE NOCASE,
	kind        TEXT NOT NULL CHECK (kind IN ('preparacion', 'producto_final', 'combo')),
	category    TEXT,
	yield_qty   REAL NOT NULL DEFAULT 1 CHECK (yield_qty > 0),
	yield_unit  TEXT NOT NULL DEFAULT 'pieza' CHECK (yield_unit IN ('g', 'ml', 'pieza', 'oz')),
	notes       TEXT,
	active      INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
	created_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
	updated_at  TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX ix_recipes_kind ON recipes (kind, active);

-- Componentes de una receta: un ingrediente o una sub-receta (nunca ambos)
CREATE TABLE recipe_items (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	recipe_id     INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	ingredient_id INTEGER REFERENCES ingredients (id) ON DELETE RESTRICT,
	sub_recipe_id INTEGER REFERENCES recipes (id) ON DELETE RESTRICT,
	quantity      REAL NOT NULL CHECK (quantity > 0),
	notes         TEXT,
	sort_order    INTEGER NOT NULL DEFAULT 0,
	CHECK ((ingredient_id IS NULL) <> (sub_recipe_id IS NULL)),
	CHECK (sub_recipe_id IS NULL OR sub_recipe_id <> recipe_id)
);
CREATE INDEX ix_recipe_items_recipe ON recipe_items (recipe_id);
CREATE INDEX ix_recipe_items_ingredient ON recipe_items (ingredient_id);
CREATE INDEX ix_recipe_items_sub_recipe ON recipe_items (sub_recipe_id);

-- Precio de venta por producto y canal (con IVA incluido)
CREATE TABLE recipe_prices (
	recipe_id  INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	channel_id INTEGER NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
	price      REAL NOT NULL CHECK (price >= 0),
	updated_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
	PRIMARY KEY (recipe_id, channel_id)
);

CREATE TABLE recipe_price_history (
	id         INTEGER PRIMARY KEY AUTOINCREMENT,
	recipe_id  INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	channel_id INTEGER NOT NULL REFERENCES channels (id) ON DELETE CASCADE,
	old_price  REAL,
	new_price  REAL NOT NULL,
	changed_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TRIGGER trg_recipe_prices_history
AFTER UPDATE OF price ON recipe_prices
WHEN OLD.price IS NOT NEW.price
BEGIN
	INSERT INTO recipe_price_history (recipe_id, channel_id, old_price, new_price)
	VALUES (NEW.recipe_id, NEW.channel_id, OLD.price, NEW.price);
END;

-- Alias aprendidos para reconocer productos en capturas de tickets
CREATE TABLE recipe_aliases (
	id         INTEGER PRIMARY KEY AUTOINCREMENT,
	alias_key  TEXT NOT NULL UNIQUE,
	recipe_id  INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

-- ---------------------------------------------------------------------
-- Modificadores (extras, variantes, terminaciones)
--   defines_variant = 1 : el grupo elige la variante (p.ej. proteína) y
--                         su costo ya está en la receta elegida.
--   defines_variant = 0 : extra / guarnición; su costo se suma aparte.
-- ---------------------------------------------------------------------
CREATE TABLE modifier_groups (
	id              INTEGER PRIMARY KEY AUTOINCREMENT,
	name            TEXT NOT NULL UNIQUE COLLATE NOCASE,
	defines_variant INTEGER NOT NULL DEFAULT 0 CHECK (defines_variant IN (0, 1)),
	notes           TEXT
);

CREATE TABLE modifier_options (
	id            INTEGER PRIMARY KEY AUTOINCREMENT,
	group_id      INTEGER NOT NULL REFERENCES modifier_groups (id) ON DELETE CASCADE,
	name          TEXT NOT NULL COLLATE NOCASE,
	price_delta   REAL NOT NULL DEFAULT 0,
	ingredient_id INTEGER REFERENCES ingredients (id) ON DELETE SET NULL,
	sub_recipe_id INTEGER REFERENCES recipes (id) ON DELETE SET NULL,
	quantity      REAL NOT NULL DEFAULT 0 CHECK (quantity >= 0),
	fixed_cost    REAL NOT NULL DEFAULT 0 CHECK (fixed_cost >= 0),
	active        INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
	UNIQUE (group_id, name)
);

CREATE TABLE recipe_modifier_groups (
	recipe_id INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	group_id  INTEGER NOT NULL REFERENCES modifier_groups (id) ON DELETE CASCADE,
	PRIMARY KEY (recipe_id, group_id)
);

-- ---------------------------------------------------------------------
-- Promociones
-- ---------------------------------------------------------------------
CREATE TABLE promotions (
	id              INTEGER PRIMARY KEY AUTOINCREMENT,
	name            TEXT NOT NULL,
	type            TEXT NOT NULL CHECK (type IN ('porcentaje', 'monto_fijo', '2x1', 'precio_especial', 'producto_gratis', 'otro')),
	value           REAL NOT NULL DEFAULT 0,
	absorbed_by     TEXT NOT NULL DEFAULT 'tienda' CHECK (absorbed_by IN ('tienda', 'plataforma', 'compartido')),
	store_share_pct REAL NOT NULL DEFAULT 1 CHECK (store_share_pct >= 0 AND store_share_pct <= 1),
	channel_id      INTEGER REFERENCES channels (id) ON DELETE SET NULL,
	starts_on       TEXT,
	ends_on         TEXT,
	notes           TEXT,
	active          INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1)),
	created_at      TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);

CREATE TABLE promotion_recipes (
	promotion_id INTEGER NOT NULL REFERENCES promotions (id) ON DELETE CASCADE,
	recipe_id    INTEGER NOT NULL REFERENCES recipes (id) ON DELETE CASCADE,
	PRIMARY KEY (promotion_id, recipe_id)
);

-- ---------------------------------------------------------------------
-- Pedidos (ventas). Todos los importes se guardan como "foto" del
-- momento de la venta para que cambios posteriores de costos, precios
-- o comisiones no alteren el histórico.
-- ---------------------------------------------------------------------
CREATE TABLE orders (
	id                 INTEGER PRIMARY KEY AUTOINCREMENT,
	channel_id         INTEGER NOT NULL REFERENCES channels (id) ON DELETE RESTRICT,
	ordered_at         TEXT NOT NULL,              -- 'YYYY-MM-DD HH:MM' hora local
	external_ref       TEXT,                       -- folio / ID de la plataforma
	status             TEXT NOT NULL DEFAULT 'completado' CHECK (status IN ('completado', 'cancelado')),
	source             TEXT NOT NULL DEFAULT 'manual' CHECK (source IN ('manual', 'ocr')),
	gross_amount       REAL NOT NULL DEFAULT 0,    -- suma de productos + modificadores
	discount_store     REAL NOT NULL DEFAULT 0,    -- promociones que paga la tienda
	discount_platform  REAL NOT NULL DEFAULT 0,    -- promociones que paga la plataforma (informativo)
	net_sale           REAL NOT NULL DEFAULT 0,    -- gross - discount_store (con IVA)
	iva_rate           REAL NOT NULL DEFAULT 0.16,
	iva_amount         REAL NOT NULL DEFAULT 0,    -- IVA trasladado
	commission_pct     REAL NOT NULL DEFAULT 0,
	commission_amount  REAL NOT NULL DEFAULT 0,
	isr_ret_pct        REAL NOT NULL DEFAULT 0,
	isr_ret_amount     REAL NOT NULL DEFAULT 0,
	iva_ret_pct        REAL NOT NULL DEFAULT 0,
	iva_ret_amount     REAL NOT NULL DEFAULT 0,
	cost_amount        REAL NOT NULL DEFAULT 0,    -- costo de producción (insumos + empaque)
	profit_amount      REAL NOT NULL DEFAULT 0,    -- utilidad real
	payout_amount      REAL NOT NULL DEFAULT 0,    -- depósito esperado de la plataforma
	reported_payout    REAL,                       -- depósito reportado en el ticket (para conciliar)
	notes              TEXT,
	created_at         TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
	updated_at         TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
);
CREATE INDEX ix_orders_ordered_at ON orders (ordered_at);
CREATE INDEX ix_orders_channel ON orders (channel_id, ordered_at);

CREATE TABLE order_items (
	id              INTEGER PRIMARY KEY AUTOINCREMENT,
	order_id        INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
	parent_item_id  INTEGER REFERENCES order_items (id) ON DELETE CASCADE, -- hijo de un combo
	recipe_id       INTEGER REFERENCES recipes (id) ON DELETE SET NULL,
	name            TEXT NOT NULL,
	quantity        REAL NOT NULL DEFAULT 1 CHECK (quantity > 0),
	unit_price      REAL NOT NULL DEFAULT 0,       -- precio base unitario
	modifiers_price REAL NOT NULL DEFAULT 0,       -- suma de modificadores por unidad
	line_total      REAL NOT NULL DEFAULT 0,       -- quantity * (unit_price + modifiers_price)
	recipe_cost     REAL NOT NULL DEFAULT 0,       -- costo unitario de la receta al momento de la venta
	unit_cost       REAL NOT NULL DEFAULT 0,       -- costo unitario (receta + modificadores)
	line_cost       REAL NOT NULL DEFAULT 0,
	sort_order      INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX ix_order_items_order ON order_items (order_id);
CREATE INDEX ix_order_items_recipe ON order_items (recipe_id);

CREATE TABLE order_item_modifiers (
	id                 INTEGER PRIMARY KEY AUTOINCREMENT,
	order_item_id      INTEGER NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
	modifier_option_id INTEGER REFERENCES modifier_options (id) ON DELETE SET NULL,
	group_name         TEXT,
	name               TEXT NOT NULL,
	quantity           REAL NOT NULL DEFAULT 1,
	price_delta        REAL NOT NULL DEFAULT 0,
	cost_delta         REAL NOT NULL DEFAULT 0
);
CREATE INDEX ix_order_item_modifiers_item ON order_item_modifiers (order_item_id);

CREATE TABLE order_promotions (
	id              INTEGER PRIMARY KEY AUTOINCREMENT,
	order_id        INTEGER NOT NULL REFERENCES orders (id) ON DELETE CASCADE,
	promotion_id    INTEGER REFERENCES promotions (id) ON DELETE SET NULL,
	description     TEXT NOT NULL,
	type            TEXT NOT NULL DEFAULT 'otro',
	store_amount    REAL NOT NULL DEFAULT 0,
	platform_amount REAL NOT NULL DEFAULT 0
);
CREATE INDEX ix_order_promotions_order ON order_promotions (order_id);

CREATE TABLE order_promotion_items (
	order_promotion_id INTEGER NOT NULL REFERENCES order_promotions (id) ON DELETE CASCADE,
	order_item_id      INTEGER NOT NULL REFERENCES order_items (id) ON DELETE CASCADE,
	PRIMARY KEY (order_promotion_id, order_item_id)
);

-- ---------------------------------------------------------------------
-- Gastos fijos (para punto de equilibrio)
-- ---------------------------------------------------------------------
CREATE TABLE fixed_expenses (
	id        INTEGER PRIMARY KEY AUTOINCREMENT,
	name      TEXT NOT NULL,
	category  TEXT,
	amount    REAL NOT NULL CHECK (amount >= 0),
	frequency TEXT NOT NULL DEFAULT 'mensual' CHECK (frequency IN ('diario', 'semanal', 'quincenal', 'mensual', 'anual')),
	notes     TEXT,
	active    INTEGER NOT NULL DEFAULT 1 CHECK (active IN (0, 1))
);
